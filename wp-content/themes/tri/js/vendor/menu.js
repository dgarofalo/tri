/**
 * UiKit Menu.js
 * Copyright 2014 UiKit.
 *
 * Standard menu display plugin. Accepts selectors so
 * it can be used as a general menu.
 *
 * Example Usage:
 * $("#nav").Menu({ 'speed' : 1000 });
 *
 */
(function($) {
    "use strict";

	var _namespace = 'Menu',
        g = this;

    function _bindEvents() {
        var _self = this;

        // If using Hover Intent
        if (_self.options.useHI) {
            this.$triggers.hoverIntent({
                over : function(e) {
                    _self.showMenu($(this));
                },
                out : function(e) {
                    if ($(this).hasClass(_self.options.activeClassName)) {
                        _self.closeMenu($(this));
                    }
                },
                timeout: _self.options.delay
            });

        } else {
            this.$triggers.on('mouseenter.' + _namespace, function() {
                if ($(this).hasClass(_self.options.activeClassName)) {
                    return clearTimeout(_self.hoverTimeout);
                }
                _self.showMenu($(this));
            }).on('mouseleave.'  + _namespace, function() {
                clearTimeout(_self.hoverTimeout);

                if ($(this).hasClass(_self.options.activeClassName)) {
                    var $activeMenu = $(this);
                    _self.hoverTimeout = window.setTimeout(function() {
                        _self.closeMenu($activeMenu);
                    }, _self.options.delay);
                }
            });
        }
    }


    /**
     * Returns the proper jQuery object by an object reference, the same jQuery identity or the index in number or string
     *
     * @param $h {object|number|string} the param reference of the trigger
     * @return {object} the jQuery object wrapping the param reference
     * @private
     */
    function _getTriggerReference($h) {
        if(typeof $h == 'string') {
            $h = parseInt($h);
        }
        if(typeof $h == 'number' && !isNaN($h)) {
            $h = this.$triggers.eq($h);
        }
        if(typeof $h == 'object' && !$h['jquery'] && $h.hasOwnProperty('index')) {
            $h = this.$triggers.eq($h['index']);
        }
        return $h;
    }


	var Menu = g.Menu = function(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = $.extend({}, Menu.defaults, options);
        this.version = "1.0.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower
		this.hoverTimeout = null;
        this.$triggers = this.$el.find(this.options.triggerSelector);
        this.busy = false;

        // init
        _bindEvents.call(this);

        this.$el.trigger('ready.' + _namespace);
    };

	Menu.defaults = {
		'triggerSelector' : '.menu-item-has-children',
		'menuSelector' : '.sub-menu',
		'transitionSpeed' : 300,
		'delay' : 0,
		'useHI' : true,
         activeClassName: g.hasOwnProperty('utilities') ? g.utilities.activeClass : 'ui-active'
	};

    Menu.prototype = {
		/**
		 * Shows the sub menu based on a specified trigger
		 *
		 * @param $trigger Object
		 */
		showMenu : function($trigger) {
			var _self = this,
                canSetTimeout = (arguments.length > 1) ? arguments[1] : null,
                $menu;

            $trigger = _getTriggerReference.call(_self, $trigger);

            if ($trigger.hasClass(this.options.activeClassName) || this.busy) return;

            $menu = $trigger.find(_self.options.menuSelector);

			if (!$menu.length) return;

			this.busy = true;

            // @todo: Add to plugin base class as a getter method
            var eventObj = {
                trigger: $trigger,
                menu: $menu
            };

            _self.$el.trigger({type: 'show.' + _namespace, extra: eventObj});

            $trigger.addClass(this.options.activeClassName);
			$menu.addClass(this.options.activeClassName);

            // Transition
            g.utilities.checkTransition(
                $menu, 'shown.' + _namespace, eventObj, function() {
                    _self.busy = false;
                }
            );

			/**
			 * If someone passes in an integer parameter we can set a timeout and delay the closing of the menu
			 * by that amount
			 */
			if (typeof canSetTimeout === 'number') {
				window.setTimeout(function($trigger) {
					_self.closeMenu($trigger);
				}, canSetTimeout, $trigger);
			}
			return this.$el;
		},


		/**
		 * Hides the sub menu based on a specified trigger
		 *
		 * @param $trigger Object
		 */
		closeMenu : function($trigger) {
			var _self = this,
				$menu;

            $trigger = _getTriggerReference.call(_self, $trigger);
            $menu = $trigger.find(_self.options.menuSelector);

            var eventObj = {
                trigger: $trigger,
                menu: $menu
            };

            _self.$el.trigger({type: 'hide.' + _namespace, extra: eventObj});

            $trigger.removeClass(this.options.activeClassName);
            $menu.removeClass(this.options.activeClassName);

            // Transition
            g.utilities.checkTransition(
                $menu, 'hidden.' + _namespace, eventObj, function() {
                    _self.busy = false;
                }
            );
        },


		/**
		 * Clears out the hover intent timeout and delay properties.
		 * Useful when trying to call "closeMenu" from the api and need to also clear out the
		 * hover intent settings so that if a user hovers back over the menu will show again.
		 *
		 * @param $trigger Object
		 */
		clearHITimeout : function($trigger) {
            $trigger = _getTriggerReference.call(this, $trigger);

			clearTimeout($trigger.attr("hoverIntent_t"));
			$trigger.attr("hoverIntent_s", 0);
            return this.$el;
		},


        /**
         * Unsets the bound events on the object
         */
        unset : function() {
			var _self = this,
				$triggers = this.$triggers.removeClass(this.options.activeClassName);

			// unbind events
            if (this.options.useHI) {
                $triggers.off('mouseenter mouseleave').each(function() {
					_self.clearHITimeout($(this));
				});
            } else {
                $triggers.off('.' + _namespace);
            }

            this.$el.removeData(_namespace);
            return this.$el;
        },


        /**
         * Resets plugin back to initial state
         */
        reset : function() {
            this.unset();
			_bindEvents.call(this);
            return this.$el;
        },


        /**
         * Respond method to allow plugin to change bahvior if needed for
         * responsive functionality
         */
        respond : function() {
            return this.$el;
        }
    };

    // Plugin declaration/assignment
    g.utilities.plugins.initializer.call(Menu, _namespace);

    /**
     * Data api definition/setup/instantiation
     */
    $(function() {
        $('[data-menu]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
    });
}).call(window.UiKit, window.jQuery);