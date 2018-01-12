import Component from '@ember/component';
import $ from 'jquery';
import { observer } from '@ember/object';

export default Component.extend({
  canvas: {},
  networkId: '',

  clonedCanvas: false,
  zoom: 1,
  render: false,
  maxHeight: '',
  maxWidth: '',
  height: '',
  width: '',

  heightObserver: observer('height', function() {
    let height = this.get('height');
    if (height > this.get('maxHeight')) {
      this.set('height', this.get('maxHeight'));
    }
    $('#cloned-canvas').height(this.get('height')).width(this.get('width'));
  }),

  widthObserver: observer('width', function() {
    let width = this.get('width');
    if (width > this.get('maxWidth')) {
      this.set('width', this.get('maxWidth'));
    }
    $('#cloned-canvas').height(this.get('height')).width(this.get('width'));
  }),

  cloneCanvas(oldCanvas) {
    // create a new canvas
    let newCanvas = document.createElement('canvas');
    let context = newCanvas.getContext('2d');

    // scale cloned canvas image
    let imgWidth = oldCanvas.width * this.get('zoom');
    let imgHeight = oldCanvas.height * this.get('zoom');

    // set dimensions
    newCanvas.width = imgWidth;
    newCanvas.height = imgHeight;

    context.width = imgWidth;
    context.height = imgHeight;

    // canvas background
    context.fillStyle = '#1A1A1C';
    context.fillRect(0, 0, imgWidth, imgHeight);
    // apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0, imgWidth, imgHeight);

    // return the new canvas
    return newCanvas;
  },

  getSaveImage(waterMarkImage) {
    let canvas = this.get('clonedCanvas');
    let imgWidth = this.get('width');
    let imgHeight = this.get('height');

    let canvasCss = $('canvas#clonedCanvas').css(['top', 'left']);
    canvasCss.top = Number(_.trimEnd(canvasCss.top, 'px'));
    canvasCss.left = Number(_.trimEnd(canvasCss.left, 'px'));

    let x = canvasCss.left;
    let y = canvasCss.top;
    let sx = 0;
    let sy = 0;
    let dx = 0;
    let dy = 0;

    if (x < 0) {
      sx = x * (-1);
    } else {
      dx = x;
    }

    if (y < 0) {
      sy = y * (-1);
    } else {
      dy = y;
    }

    let domCanvas = document.createElement('canvas');
    let context = domCanvas.getContext('2d');

    domCanvas.width = imgWidth;
    domCanvas.height = imgHeight;
    context.width = imgWidth;
    context.height = imgHeight;

    // canvas background
    context.fillStyle = '#1A1A1C';
    context.fillRect(0, 0, imgWidth, imgHeight);

    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    context.drawImage(canvas, sx, sy, imgWidth, imgHeight, dx, dy, imgWidth, imgHeight);

    // watermark coordinates
    let wx = imgWidth - waterMarkImage.width - 7;
    let wy = imgHeight - waterMarkImage.height - 3;

    context.drawImage(waterMarkImage, wx, wy, waterMarkImage.width, waterMarkImage.height);

    return domCanvas;
  },

  insertCanvas() {
    // make draggable
    (function($) {
      $.fn.drags = function(opt) {

        opt = $.extend({ handle: '',cursor: 'move' }, opt);

        let $el = {};
        let $drag = {};
        if (opt.handle === '') {
          $el = this;
        } else {
          $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on('mousedown', function(e) {
          if (opt.handle === '') {
            $drag = $(this).addClass('draggable');
          } else {
            $drag = $(this).addClass('active-handle').parent().addClass('draggable');
          }
          let z_idx = $drag.css('z-index');
          let drg_h = $drag.outerHeight();
          let drg_w = $drag.outerWidth();
          let pos_y = $drag.offset().top + drg_h - e.pageY;
          let pos_x = $drag.offset().left + drg_w - e.pageX;
          $drag.css('z-index', 1000).parents().on('mousemove', function(e) {
            $('.draggable').offset({
              top: e.pageY + pos_y - drg_h,
              left: e.pageX + pos_x - drg_w
            }).on('mouseup', function() {
              $(this).removeClass('draggable').css('z-index', z_idx);
            });
          });
          e.preventDefault(); // disable selection
        }).on('mouseup', function() {
          if (opt.handle === '') {
            $(this).removeClass('draggable');
          } else {
            $(this).removeClass('active-handle').parent().removeClass('draggable');
          }
        });

      };
    })($);

    // jquery object
    let canvas = this.get('canvas');
    let clonedCanvas = this.cloneCanvas(canvas.get(0));
    this.set('clonedCanvas', clonedCanvas);

    let $clonedCanvas = $('#modalEmbeding #cloned-canvas')
      .empty()
      .append($(clonedCanvas).attr('id', 'clonedCanvas')).find('#clonedCanvas');

    // make canvas draggable
    $clonedCanvas.drags();

    // center canvas
    let left = (this.get('width') - clonedCanvas.width) / 2;
    let top = (this.get('height') - clonedCanvas.height) / 2;
    $clonedCanvas.css({ 'left': `${left}px`, 'top': `${top}px` });
  },

  setDefaultDimensions() {
    let $canvas = this.get('canvas');
    let oldCanvas = $canvas.get(0);
    this.set('maxHeight', oldCanvas.height);
    this.set('maxWidth', oldCanvas.width);

    let container = $('#cloned-canvas');
    this.set('height', container.height());
    this.set('width', container.width());

  },

  didRender() {
    if (!this.get('render')) {
      this.setDefaultDimensions();
      this.insertCanvas();
      let self = this;

      // load the watermark image
      let image = new Image(55, 33);   // using optional size for image
      image.src = `${document.location.origin}/images/elvis-water-mark3.png`;

      // if the image is loaded add the eventListener to the save image link
      image.onload = function() {
        document.getElementById('downloadLnk')
          .addEventListener('click', function() {
            // get the canvas for the image to be saved
            let canvas = self.getSaveImage(image);
            let dt = canvas.toDataURL();
            $('#downloadLnk').attr('href', dt);
          }, false);
      };
      this.set('render', true);
    }
  },

  didReceiveAttrs() {
    let networkId = this.get('networkId');
    this.set('networkLink', `${document.location.origin}/network/${networkId}`);
  },

  actions: {
    closeModal() {
      this.sendAction('action');
    },

    zoom(type) {
      let zoom = this.get('zoom');
      if (type == 'out' && zoom > 0) {
        this.set('zoom', zoom - 0.1);
        this.insertCanvas();
      } else if (type == 'in' && zoom < 1) {
        this.set('zoom', zoom + 0.1);
        this.insertCanvas();
      }
    }
  }
});
