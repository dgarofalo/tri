/**
 * UiKit Parallax.js
 * Version: 1.0.0
 * Copyright 2015 UiKit.
 *
 */
(function($) {
    "use strict";

    var _namespace = "Parallax",
        g = this;


    /**
     * Performs all the even binding on the window and the current $el widget, for transitions, clicks,
     * be it direct or delegated.
     *
     * @private
     */
    function _bindEvents() {
        var _self = this;

        if(_self.options.mode == 'windowScroll') {
            $(window).on('scroll.' + _namespace, g.utilities.throttle(function() {
                _self.scroll({
                    x: document.body.scrollLeft + (window.innerWidth/2),
                    y:  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop + (window.innerHeight/2)
                });
            }, 50));
            _self.scroll({
                x: document.body.scrollLeft + (window.innerWidth/2),
                y:  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop + (window.innerHeight/2)
            }); //only works for 2D transforms
        }
    }


    function _getTranslate2D(el) {
        var elStyle = window.getComputedStyle(el, null),
            transformMatrix = elStyle.getPropertyValue("-webkit-transform") ||
                elStyle.getPropertyValue("-moz-transform") ||
                elStyle.getPropertyValue("-ms-transform") ||
                elStyle.getPropertyValue("-o-transform") ||
                elStyle.getPropertyValue("transform"),
            values;

        if(transformMatrix == 'none') {
            return { x: 0, y: 0 };
        }
        values = transformMatrix.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');

        return { x: values[4], y: values[5] };
    }


    var Parallax = g.Parallax = function(el, options) {
        this.$el = $(el);
        this.el = el;
        this.options = $.extend({}, Parallax.defaults, options);;
        this.version = "1.0.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower

        _bindEvents.call(this);

        return this;
    };


    Parallax.defaults = {
        property : 'top',
        tipDistance: 0.5,
        viewDistance: 5,
        mode: 'windowScroll'  //Available modes windowScroll, mouseMove
    };


    Parallax.prototype = {
        scroll: function(tipCoordinates) {
            var top = this.$el.offset().top,
                height = this.el.offsetHeight,
                translate2D = _getTranslate2D(this.el),
                cameraMiddleY = top + (height/2) - translate2D.y,
                translateY = (cameraMiddleY - tipCoordinates.y) * this.options.tipDistance / this.options.viewDistance;

            // Check if totally above or totally below viewport
            if (Math.abs(tipCoordinates.y - cameraMiddleY) > ((window.innerHeight / 2) + height)) {
                return;
            }

            if(this.options.property == 'backgroundPosition') {
                this.$el.css('backgroundPosition', "50% " + translateY + "px");
            }else {
                this.$el.css('transform', 'translateY(' + translateY + 'px)').css('-ms-transform', 'translateY(' + translateY + 'px)');
            }
        },


        reset: function() {
            this.unset();

            this.$el = this.$el.offset().top;
            _bindEvents.call(this);
            return this.$el;
        },


        unset: function() {
            $(window).off('.' + _namespace);
            return this.$el;
        }
    };


    // Plugin declaration/assignment
    g.utilities.plugins.initializer.call(Parallax, _namespace);

    $(function() {
        /**
         * Each element containing the attribute data-parallax will be bound to specific actions:
         *
         */
        $('[data-parallax]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
    });

}).call(window.UiKit, window.jQuery);