/**
 * UiKit inview.js
 * Copyright 2015 UiKit.
 *
 */
(function($) {
    "use strict";

    var _namespace = 'Inview',
        g = this;


    function _bindEvents() {
        var _self = this;

        /**
         * Attach a scroll handler to the window;
         * run our callback if this element is in the viewport.
         * Uses the window object directly to attach the handler;
         * all other calls are on the cached object.
         */
        $(window).on('scroll.' + _namespace, g.utilities.throttle(function (e) {
            // prevent script-created events from bubbling
            if ('undefined' === typeof e.originalEvent) {
                e.preventDefault();
            }
            _self.observeScroll();
            return true;
        }, 50));
    }


    /**
     * Unbinds all self and delegated events to the element container and the window object
     *
     * @private
     */
    function _unbindEvents() {
        $(window).off('.' + _namespace)
    }


    var Inview = g.Inview = function (el, options) {

        this.$el = $(el);
        this.options = $.extend({}, Inview.defaults, options);
        this.version = "1.1.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower


        // store the top offset of this element, subtracting any extra offset
        // added by fixed/absolutely positioned elements
        this.offsetTop = this.$el.offset().top - this.options.extraOffset;
        this.scrollTop = window.scrollY;


        // store the element's outerHeight
        this.outerHeight = el.offsetHeight;
        this.inview = false;

        // bind it up and fire it off
        _bindEvents.call(this);
        this.observeScroll().trigger('ready.' + _namespace);
    };

    Inview.defaults = {
        extraOffset: 0,     // used in the presence of any fixed or absolutely positioned element(s) to determine offset
        onReady: $.noop     // callback function invoked when the plugin is ready and configured.
    };

    Inview.prototype = {
        /**
         * Scroll handler for the window:
         * trigger callback when this element is in the viewport, and when it leaves
         */
        observeScroll: function () {
            var self = this,
                $window = $(window),    // cache the window object
                scrollDirection,
                currentScroll = $window.scrollTop();

            if(self.$el.is(':hidden')){
                return;
            }

            // which direction scroll? 1: up, -1: down
            scrollDirection = self.scrollTop < currentScroll ? 1 : -1;
            self.scrollTop = currentScroll;
            self.offsetTop = self.$el.offset().top - self.options.extraOffset;

            // determine our location
            var viewportDepth = currentScroll + $window.height(),
                elementOffset = self.offsetTop - self.options.extraOffset,
                elementDepth = self.offsetTop + self.outerHeight - self.options.extraOffset;

            // check if it's in the viewport
            if (viewportDepth > elementOffset && elementDepth > currentScroll) {
                if (!self.inview) {
                    self.inview = true;
                    self.$el.addClass('viewable-in-view');
                    self.$el.trigger({
                        type: 'in.' + _namespace,
                        direction: scrollDirection
                    });
                }
            } else if (self.inview) {
                if (self.inview) {
                    //self.inview = false;
                    //self.$el.removeClass('viewable-in-view');
                    self.$el.trigger({type: 'out.' + _namespace, direction: scrollDirection});
                }
            }
            return this.$el;
        },


        /**
         * Unsets all bound events
         */
        unset : function() {
            _unbindEvents.call(this);
            this.$el.removeData(_namespace);
            return this.$el;
        },


        /**
         * Resets the plugin functionality back to square one
         */
        reset : function() {
            _bindEvents.call(this);
            return this.$el;
        },


        /**
         * Handles any respond needs
         */
        respond : function() {
            return this.$el;
        }
    };

    // Plugin declaration/assignment
    g.utilities.plugins.initializer.call(Inview, _namespace);

    /**
     * Data api definition/setup/instantiation
     */
    $(function() {
        /**
         * Each element containing the attribute data-inview will be bound to specific actions:
         *
         * If the attribute is empty or is not defined like in
         * <div id="inview1" data-inview></div> then we initialize the plugin in a DOM element.
         *
         * If the attribute contains an string, this will map an specific action like in:
         * <button data-inview="unset" data-target="#inview1" /> then we execute:
         * $("#inview1").Inview('unset');
         */
        $('[data-inview]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
    });
}).call(window.UiKit, window.jQuery);
