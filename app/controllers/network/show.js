import Ember from 'ember';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

const { Logger } = Ember;

export default Controller.extend({
  me: service(),
  ajax: service(),

  height: window.innerHeight - 100,
  selectedNodes: [],
  selectedEdges: [],
  networkOptions: {
    'nodes': {
      'shape': 'dot',
      'scaling': {
        'min': 5,
        'max': 30
        // 'label': {
        //   'enabled': true
        // }
      },
      'font': {
        'face': 'Roboto Condensed',
        'size': 9,
        'color': 'rgba(255, 255, 255, .5)'
      }
    },
    'edges': {
      'arrows': {
        'to': {
          'enabled': true,
          'scaleFactor': 0.1
        },
        'middle': {
          'enabled': false,
          'scaleFactor': 0.1
        },
        'from': {
          'enabled': false,
          'scaleFactor': 0.1
        }
      },
      // 'arrowStrikethrough': false,
      'color': {
        'color': '#313939',
        'highlight': '#b1b1b1'
      },
      'font': {
        'face': 'Roboto Condensed',
        'size': 8,
        'color': 'rgba(255, 255, 255, .5)'
      },
      'scaling': {
        'label': {
          'enabled': false
        }
      }
    },
    'layout': {
      'improvedLayout': true
    },
    'physics': {
      // 'enabled': true,
      'enabled': true,
      // 'maxVelocity': 50,
      'maxVelocity': 50,
      // 'minVelocity': 0.1,
      'minVelocity': 0.1,
      // 'solver': 'barnesHut',
      'solver': 'barnesHut',
      // 'timestep': 0.5,
      'timestep': 0.3,
      // 'adaptiveTimestep': true
      'adaptiveTimestep': true,
      'barnesHut': {
        'gravitationalConstant': -1000,
        'springConstant': 0.04,
        'damping': 0.2
      },
      'stabilization': {
        'enabled': true,
        // 'iterations': 1000,
        'iterations': 10,
        'updateInterval': 100,
        'onlyDynamicEdges': false,
        'fit': true
      }
    },
    'interaction': {
      'hover': true,
      'hoverConnectedEdges': true,
      'navigationButtons': true,
      'keyboard': false
    }
  },

  networkInfoShown: false,
  clusters: {},

  networkLinkModal: false,
  networkClusteringModal: false,
  networkEmbeddingModal: false,
  networkStabilization: false,
  networkLoaded: false,

  crop: {
    container: {
      cropper: '.vis-network > canvas',
      widthInput: '.crop-controls #canvasWidth',
      heightInput:  '.crop-controls #canvasHeight'
    },
    maxWidth: 100,
    maxHeight: 100,
    minWidth: 50,
    minHeight: 50,
    width: 100,
    height: 100,
    boxData: {}
  },

  defer() {
    let res, rej;

    let promise = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });

    promise.resolve = res;
    promise.reject = rej;

    return promise;
  },

  init() {
    this._super();
    this.set('stabilizationPercent', 0);
    this.set('network', undefined);
    this.set('networkDefer', this.defer());
  },

  didInsertElement() {
    $('div#stabilization-info').height(window.innnerHeight - 200);
  },

  showNetworkInfo() {
    let start = this.get('startStabilizing');
    let end = performance.now();
    let timeS = _.ceil((end - start), 2);
    let iterations = this.get('stIterations');
    let nodes = this.get('model.graph.nodes').length;
    let edges = this.get('model.graph.edges').length;
    let message =
      `
          <div id="network-info">
            <p>Network info</p>
            <div class="info">
              <div class="info-name">Stabilization</div>
              <div class="info-val">${timeS} ms</div>
            </div>
            <div class="info">
              <div class="info-name">Iterations</div>
              <div class="info-val">${iterations}</div>
            </div>
            <div class="info">
              <div class="info-name">Nodes</div>
              <div class="info-val">${nodes}</div>
            </div>
            <div class="info">
              <div class="info-name">Edges</div>
              <div class="info-val">${edges}</div>
            </div>
          </div>
        `;
    this.notifications.success(message, {
      autoClear: true,
      htmlContent: true
    });
  },

  // cropping
  updateCropValues($canvas) {
    let $widthInput = $(this.get('crop.container.widthInput'));
    let $heightInput = $(this.get('crop.container.heightInput'));
    let cropBoxData = $canvas.cropper('getCropBoxData');

    $widthInput.val(_.ceil(cropBoxData.width));
    $heightInput.val(_.ceil(cropBoxData.height));
  },

  cropNetwork() {
    let self = this;
    let $canvas = $(this.get('crop.container.cropper'));

    // jscs:disable requireEnhancedObjectLiterals
    $canvas.cropper({
      ready: function() {

        // if there are crop data the start croper with these settings
        if (Object.keys(self.get('crop.boxData')).length > 0) {
          $canvas.cropper('setCropBoxData', self.get('crop.boxData'));
        } else {
          self.set('crop.boxData', $canvas.cropper('getCropBoxData'));
        }
        self.setCropControls();
        // set inputs values from copper
        self.updateCropValues($canvas);
        $('.cropper-container .cropper-crop-box')
          .prepend('<div class="crop-edit">Edit network</div>')
          .find('.crop-edit').on('click', function() {
            self.cropEditNetwork();
          });
      },
      cropmove: function() {
        self.updateCropValues($canvas);
      },
      zoom: function() {
        self.cropEditNetwork();
      }
    });
    // jscs:enable requireEnhancedObjectLiterals
  },

  cropEditNetwork() {

    // clone crop-box
    let self = this;
    let $cropBox = $('.cropper-container .cropper-crop-box').clone();
    let $cropBoxFake = $('.crop-fake').show().append($($cropBox));
    let $controlsCrop = $cropBoxFake.find('.cropper-line, .cropper-point');
    $cropBoxFake.find('.crop-edit')
      .text('Edit Crop')
      .on('click', function() {
      $('.crop-fake .go-back-crop').click();
    });

    $controlsCrop
      .mouseover(function() {
        $controlsCrop.not($(this)).addClass('hovered');
      })
      .mouseout(function() {
        $controlsCrop.not($(this)).removeClass('hovered');
      })
      .click(function() {
        self.goBackCropEdit();
        $('.crop-fake .go-back-crop').click();
      });

    this.removeCrop();
  },

  goBackCropEdit() {
    $('.crop-fake .cropper-crop-box').remove();
    $('.crop-fake').hide();
  },

  removeCrop() {

    $('.crop-controls').hide();
    let $canvas = $(this.get('crop.container.cropper'));
    this.set('crop.boxData', $canvas.cropper('getCropBoxData'));

    $canvas.cropper('destroy');
    this.set('croppingStatus', false);
  },

  setSaveControl() {
    // save button
    let self = this;

    // load the watermark image
    let image = new Image(55, 33);   // using optional size for image
    image.src = `${document.location.origin}/images/elvis-water-mark3.png`;

    // if the image is loaded add the eventListener to the save image link
    image.onload = function() {
      document.getElementById('downloadLnk')
        .addEventListener('click', function() {
          // get the canvas for the image to be saved
          let $canvas = $(self.get('crop.container.cropper'));
          let cropBoxData = $canvas.cropper('getCropBoxData');
          let { height, width } = cropBoxData;

          // watermark coordinates
          let wx = width - 7;
          let wy = height - 3;

          let croppedCanvas = $canvas.cropper('getCroppedCanvas', {
            imageSmoothingEnabled: false,
            imageSmoothingQuality: 'high',
            fillColor: '#1A1A1C'
          });
          let context = croppedCanvas.getContext('2d');
          context.drawImage(image, wx, wy, image.width, image.height);

          let dt = croppedCanvas.toDataURL();
          $('#downloadLnk').attr('href', dt);
        }, false);
    };
  },

  setDimensionControls() {
    let $widthInput = $(this.get('crop.container.widthInput'));
    let $heightInput = $(this.get('crop.container.heightInput'));
    let minWidth =  this.get('crop.minWidth');
    let minHeight = this.get('crop.minHeight');

    let $canvas = $(this.get('crop.container.cropper'));

    // width input
    // check to see if the input value is higher than min and update the cropper
    $widthInput.focusout(function() {
      let inputVal = Number($(this).val());
      if (inputVal < minWidth || inputVal === '') {
        inputVal = minWidth;
        $(this).val(minWidth);
      }
      let cropBoxData = $canvas.cropper('getCropBoxData');
      cropBoxData.width = inputVal;

      $canvas.cropper('setCropBoxData', cropBoxData);
    });

    // height input
    // check to see if the input value is higher than min and update the cropper
    $heightInput.focusout(function() {
      let inputVal = Number($(this).val());
      if (inputVal < minHeight || inputVal === '') {
        inputVal = minHeight;
        $(this).val(minHeight);
      }
      let cropBoxData = $canvas.cropper('getCropBoxData');
      cropBoxData.height = inputVal;
      $canvas.cropper('setCropBoxData', cropBoxData);
    });
  },

  setCropControls() {
    this.setSaveControl();
    this.setDimensionControls();
  },

  actions: {
    stopPhysics() {
      let physics = this.get('networkOptions.physics.enabled') ? false : true;
      this.set('networkOptions.physics.enabled', physics);
      this.get('network').setOptions({ 'physics': { 'enabled': physics } });
    },

    toggleCrop() {
      this.goBackCropEdit();
      if ((typeof this.get('croppingStatus') == 'undefined') || !this.get('croppingStatus')) {
        this.cropNetwork();
        $('.crop-controls').show();
        this.set('croppingStatus', true);
      } else {
        this.removeCrop();
      }
    },

    closeCrop() {
      this.removeCrop();
    },

    modalNetworkLink() {
      if (this.get('networkLinkModal')) {
        this.set('networkLinkModal', false);
      } else {
        this.set('networkLinkModal', true);
        let networkId = this.get('model.id');
        this.set('networkLink', `${document.location.origin}/network/${networkId}`);
      }
    },

    toggleInfo() {
      $('#legend').toggle();
      $('#legend').removeClass('network-just-loaded');
    },

    showClustering() {
      if (this.get('session.isAuthenticated')) {
        this.set('networkClusteringModal', true);
      } else {
        this.notifications.error('You need to be loged in before continuing.', {
          htmlContent: true,
          autoClear: false
        });
      }
    },

    showEmbedding() {
      let canvas = $('.vis-network canvas');
      this.set('visCanvas', canvas);
      this.set('networkEmbeddingModal', true);
    },

    closeEmbedding() {
      this.set('networkEmbeddingModal', false);
    },

    startStabilizing() {
      // console.log('start stabilizing', this.get('network'));
      this.set('startStabilizing', performance.now());
      // Logger.info('start stabilizing');
      this.get('networkService').setNetwork(this.get('network'), this.get('networkDefer'));
    },

    stabilizationIterationsDone() {

      if (!this.get('networkStabilization')) {
        this.showNetworkInfo();
        this.set('networkStabilization', true);
      }

      Logger.info('stabilization iterations done');
      this.set('stabilizationPercent', 100);
      $('section#legend .carousel-close').fadeIn();
      this.set('networkLoaded', true);

      this.set('networkStabilization', true);
      Logger.info('Network stabilized');
      // this.get('networkService').setNetwork(this.get('network'));
    },

    stabilizationProgress(amount) {
      this.set('stIterations', amount.total);
      this.set('stabilizationPercent', (amount.iterations / amount.total) * 100);
      Logger.info(`Stabilization progress: ${amount.iterations} / ${amount.total}`);
    },

    stabilized(event) {
      if (event.iterations > this.get('stIterations')) {
        let diff = event.iterations - this.get('stIterations');
        Logger.info(`Network was stabilized using ${diff} iterations more than assumed (${this.get('stIterations')})`);
      }
    }
  }
});
