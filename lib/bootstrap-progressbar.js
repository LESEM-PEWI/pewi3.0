/*!
 * bootstrap-progressbar v0.9.0 by @minddust
 * Copyright (c) 2012-2015 Stephan Groß
 *
 * http://www.minddust.com/project/bootstrap-progressbar/
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function($) {

    'use strict';

    // PROGRESSBAR CLASS DEFINITION
    // ============================

    var Progressbar = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Progressbar.defaults, options);
    };

    Progressbar.defaults = {
        transition_delay: 100,
        refresh_speed: 30,
        display_text: 'none',
        use_percentage: true,
        percent_format: function(percent) { return percent + '%'; },
        amount_format: function(amount_part, amount_max, amount_min) { return amount_part + ' / ' + amount_max; },
        update: $.noop,
        done: $.noop,
        fail: $.noop
    };
    var prev_percentage;
    Progressbar.prototype.transition = function() {

        var $this = this.$element;
        var $parent = $this.parent();
        // var $back_text = this.$back_text;
        // var $front_text = this.$front_text;

        var options = this.options;
        var data_transitiongoal = parseFloat($this.attr('data-transitiongoal'));
        var aria_valuemin = parseInt($this.attr('aria-valuemin')) || 0;
        var aria_valuemax = parseInt($this.attr('aria-valuemax')) || 100;
        // var is_vertical = $parent.hasClass('vertical');
        var update = options.update && typeof options.update === 'function' ? options.update : Progressbar.defaults.update;
        var done = options.done && typeof options.done === 'function' ? options.done : Progressbar.defaults.done;
        var fail = options.fail && typeof options.fail === 'function' ? options.fail : Progressbar.defaults.fail;
        if (isNaN(data_transitiongoal)) {
            fail('data-transitiongoal not set');
            return;
        }
        var percentage = (100 * (data_transitiongoal - aria_valuemin) / (aria_valuemax - aria_valuemin)).toFixed(1);
        // if (options.display_text === 'center' && !$back_text && !$front_text) {
        //     this.$back_text = $back_text = $('<span>').addClass('progressbar-back-text').prependTo($parent);
        //     this.$front_text = $front_text = $('<span>').addClass('progressbar-front-text').prependTo($this);
        //
        //     var parent_size;
        //
        //     if (is_vertical) {
        //         parent_size = $parent.css('height');
        //         $back_text.css({height: parent_size, 'line-height': parent_size});
        //         $front_text.css({height: parent_size, 'line-height': parent_size});
        //
        //         $(window).resize(function() {
        //             parent_size = $parent.css('height');
        //             $back_text.css({height: parent_size, 'line-height': parent_size});
        //             $front_text.css({height: parent_size, 'line-height': parent_size});
        //         }); // normal resizing would brick the structure because width is in px
        //     }
        //     else {
        //         parent_size = $parent.css('width');
        //         $front_text.css({width: parent_size});
        //
        //         $(window).resize(function() {
        //             parent_size = $parent.css('width');
        //             $front_text.css({width: parent_size});
        //         }); // normal resizing would brick the structure because width is in px
        //     }
        // }
        // console.log('this ',$this);
        // console.log('prev_percentage',prev_percentage)
        setTimeout(function() {
          var current_percentage;
          var current_value;
          var this_size;
          var parent_size;

          this_size = $this.width();
          parent_size = $parent.width();


        current_percentage = parseFloat(100 * this_size / parent_size).toFixed(1);
        current_value = parseFloat(aria_valuemin + this_size / parent_size * (aria_valuemax - aria_valuemin)).toFixed(2);



        // get the current values so it can be reset
        var currentProgressBarBorderInfo = $this.css("border");
        var currentParentBorderInfo = $this.parent().css("border");



       // The last two conditions are to keep the border from turning green when the value decreases from 100 and from turning red when it is increasing to 100
        if((percentage < current_percentage || (current_percentage == 100 && percentage < 100)) && !(percentage == 100 && current_percentage < 100))
        {
          $this.css("border", "5px solid red");
          $this.parent().css("border","3px solid red");
        }

        else if(percentage > current_percentage || (percentage == 100 && current_percentage < 100))
        {
          $this.css("border", "5px solid green");
          $this.parent().css("border","3px solid green");
        }

        // resets the border color to its default after 1 second to match the progress bar transition time
        setTimeout(function(){
          $this.css("border",  "");
          $this.parent().css("border",  "1px solid white");
        }, 1000);



            // if (is_vertical) {
            //     $this.css('height', percentage + '%');
            // }
            // else {
                $this.css('width', percentage + '%');
            // }






            var progress = setInterval(function() {
                // if (is_vertical) {
                //     this_size = $this.height();
                //     parent_size = $parent.height();
                // }
                // // else {
                //     this_size = $this.width();
                //     parent_size = $parent.width();
                // // }
                //
                // current_percentage = parseFloat(100 * this_size / parent_size).toFixed(1);
                // current_value = parseFloat(aria_valuemin + this_size / parent_size * (aria_valuemax - aria_valuemin)).toFixed(1);

                if (current_percentage >= percentage || prev_percentage == current_percentage) {
                    current_percentage = percentage;
                    current_value = data_transitiongoal;
                    done($this);
                    clearInterval(progress);
                    // console.log('Done');
                }


                // if (options.display_text !== 'none') {
                //     text = options.use_percentage ? options.percent_format(current_percentage) : options.amount_format(current_value, aria_valuemax, aria_valuemin);
                //
                //     if (options.display_text === 'fill') {
                //         $this.text(text);
                //     }
                    // else if (options.display_text === 'center') {
                    //     $back_text.text(text);
                    //     $front_text.text(text);
                    // }
                // }
                // $this.attr('aria-valuenow', current_value);

                update(current_percentage, $this);



                prev_percentage = current_percentage;
            }, options.refresh_speed);
        }, options.transition_delay);


    };


    // PROGRESSBAR PLUGIN DEFINITION
    // =============================

    var old = $.fn.progressbar;

    $.fn.progressbar = function(option) {
        return this.each(function () {
            var $this = $(this);
            // console.log(this);
            var data = $this.data('bs.progressbar');
            // console.log(data);
            var options = typeof option === 'object' && option;
            if (data && options) {
                $.extend(data.options, options);
            }

            if (!data) {
                $this.data('bs.progressbar', (data = new Progressbar(this, options)));
            }
            data.transition();
        });
    };

    $.fn.progressbar.Constructor = Progressbar;


    // PROGRESSBAR NO CONFLICT
    // =======================

    $.fn.progressbar.noConflict = function () {
        $.fn.progressbar = old;
        return this;
    };

})(window.jQuery);

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
