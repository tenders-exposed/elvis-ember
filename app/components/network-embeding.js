import Ember from 'ember';

const { Component, $, observer } = Ember;

export default Component.extend({
  clonedCanvas: false,
  canvas: {},

  zoom : 0.9,

  cloneCanvas(oldCanvas) {

    //create a new canvas
    let newCanvas = document.createElement('canvas');
    let context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //scale cloned canvas image
    let imgWidth = oldCanvas.width * this.get('zoom');
    let imgHeight = oldCanvas.height * this.get('zoom');

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0, imgWidth, imgHeight );

    //return the new canvas
    return newCanvas;
  },

  insertCanvas(){
    (function($) {
      $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
          var $el = this;
        } else {
          var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
          if(opt.handle === "") {
            var $drag = $(this).addClass('draggable');
          } else {
            var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
          }
          var z_idx = $drag.css('z-index'),
            drg_h = $drag.outerHeight(),
            drg_w = $drag.outerWidth(),
            pos_y = $drag.offset().top + drg_h - e.pageY,
            pos_x = $drag.offset().left + drg_w - e.pageX;
          $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
            $('.draggable').offset({
              top:e.pageY + pos_y - drg_h,
              left:e.pageX + pos_x - drg_w
            }).on("mouseup", function() {
              $(this).removeClass('draggable').css('z-index', z_idx);
            });
          });
          e.preventDefault(); // disable selection
        }).on("mouseup", function() {
          if(opt.handle === "") {
            $(this).removeClass('draggable');
          } else {
            $(this).removeClass('active-handle').parent().removeClass('draggable');
          }
        });

      }
    })(jQuery);

    // jquery object
    let canvas = this.get('canvas');
    let clonedCanvas = this.cloneCanvas(canvas.get(0));
    $('#modalEmbeding #cloned-canvas')
      .empty()
      .append($(clonedCanvas).attr("id", "clonedCanvas")).find('#clonedCanvas').drags();;
  },

  didRender() {
    this.insertCanvas();
  },
  didReceiveAttrs() {

  },

  actions: {
    closeModal() {
      this.sendAction('action');
    },

    zoom(type) {
      let zoom = this.get('zoom');
      if(zoom == "out" && zoom > 0) {
        this.set('zoom', zoom - 0.1);
        this.insertCanvas();
      } else if(zoom == "in" && zoom < 1) {
        this.set('zoom', zoom + 0.1);
        this.insertCanvas();
      }
    },


  }
});