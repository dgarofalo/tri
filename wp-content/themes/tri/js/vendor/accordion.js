;
/**
 * UiKit Accordion.js
 * Version: 1.1.0
 *
 * Copyright {{YEAR}} UiKit.
 */
(function($) {
    "use strict";

	var _namespace = 'Accordion',
        g = this;

    /**
     * Performs all the even binding on the current $el widget, for transitions, clicks, be it direct or delegated
     *
     * @private
     */
    function _bindEvents() {
        var _self = this;
        this.$el.on('click.' + _namespace, this.options.headers, function(e) {
            _self.activate($(this));
            e.preventDefault();
        });
        if($.support.transition) {
            this.$el.on($.support.transition.end + '.' + _namespace, this.options.containers, function(e) {
                var $c = $(e.target).removeClass(_self.options.transitioningClass),
                    extras = { header: $c.data('controlledBy'), container: $c };

                _self.busy = false;
                if(e.target.offsetHeight <= 1) {
                    _self.$el.trigger('inactive.' + _namespace, extras);
                } else {
                    _self.$el.trigger('active.' + _namespace, extras);
                }
            });
        }
    }


    /**
     * Returns the proper jQuery object by an object reference, the same jQuery identity or the index in number or string
     *
     * @param $h {object|number|string} the param reference of the header
     * @return {object} the jQuery object wrapping the param reference
     * @private
     */
    function _getHeaderReference($h) {
        if(typeof $h == 'string') {
            $h = parseInt($h);
        }
        if(typeof $h == 'number' && !isNaN($h)) {
            $h = this.$headers.eq($h);
        }
        if(typeof $h == 'object' && !$h['jquery'] && $h.hasOwnProperty('index')) {
            $h = this.$headers.eq($h['index']);
        }
        return $h;
    }

	/**
	 * Constructor method
	 */
	var Accordion = g.Accordion = function(el, options) {
		this.$el = $(el);
		this.options = $.extend({}, Accordion.defaults, options);
        this.version = "1.1.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower
		this.$headers = this.$el.find(this.options.headers).attr('role','tab');
		this.$containers = this.$el.find(this.options.containers).attr('role', 'tabpanel');
		this.busy = false;

		_bindEvents.call(this);

		// set data on the object
		this.$el.trigger('ready.' + _namespace);

        return this;
	};

	Accordion.defaults = {
        'headers': '.accordion-header',
        'containers': '.accordion-content',
		'toggle': false,
		'transitionSpeed': 500,
		'activeClass' : g.hasOwnProperty('utilities') ? g.utilities.activeClass : 'ui-active',
		'inactiveClass' : g.hasOwnProperty('utilities') ? g.utilities.inactiveClass : 'ui-inactive',
		'transitioningClass' : g.hasOwnProperty('utilities') ? g.utilities.transitioningClass : 'ui-transitioning'
	};

	Accordion.prototype = {
		/**
		 * Activates a given header by its jQuery wrapper reference
		 *
		 * @param $header
         * @returns the bound jQuery Wrapped $el element
		 */
		activate: function($header) {
            var _self = this;

            $header = _getHeaderReference.call(_self, $header);

            if (this.busy) return _self.$el;
			this.busy = true;

			// check if toggling containers and collapse all
			if (this.options.toggle && !$header.hasClass(_self.options.activeClass)) {
				this.$headers.not($header).each(function() {
					_self.collapse($(this));
				});
			}

			// handle the current header
			this[$header.hasClass(_self.options.activeClass) ? 'collapse' : 'expand']($header);

            return _self.$el;
		},


        /**
         * Collapses all opened tabs
         *
         * @returns the bound jQuery Wrapped $el element
         */
        collapseAll: function () {
            var _self = this;
            this.$headers.each(function() {
                _self.collapse($(this));
            });
            return this.$el;
        },


		/**
		 * Expands a given container based on the header
		 *
		 * @param $header jQuery
		 */
		expand: function($header) {
			var _self = this,
                $_c,
                contentHeight = 0;

            $header = _getHeaderReference.call(_self, $header);
            $_c = $header.next(_self.$containers);
			if (!$_c.length || $_c.hasClass(_self.options.activeClass)) return _self.$el;

			// Calculate height before expanding
            $_c.children().each(function(ndx, el) {
                contentHeight +=  el.offsetHeight;
            });
			$_c.data('controlledBy', $header).css('height', contentHeight + 'px');

			$header.addClass(_self.options.activeClass).attr('aria-expanded', true);

            $_c.removeClass(_self.options.inactiveClass).addClass([_self.options.activeClass, _self.options.transitioningClass].join(' '));
            return _self.$el;
		},


		/**
		 * Collapses a given container based on the header
		 *
		 * @param $header jQuery
		 */
		collapse: function($header) {
			var _self = this,
                $_c,
                contentHeight = 0;

            $header = _getHeaderReference.call(_self, $header);
            $_c = $header.next(_self.$containers);
			if (!$_c.length || !$_c.hasClass(_self.options.activeClass)) return _self.$el;

			// Calculate height before collapsing
            $_c.children().each(function(ndx, el) {
                contentHeight +=  el.offsetHeight;
            });
            $_c.data('controlledBy', $header).css('height', contentHeight + 'px');

			$header.removeClass(_self.options.activeClass).attr('aria-expanded', false);

            $_c.removeClass(_self.options.activeClass).addClass([_self.options.inactiveClass, _self.options.transitioningClass].join(' '));
            return _self.$el;
		},


		/**
		 * Resets accordion back to initial state
		 */
		reset : function() {
			this.unset();
            _bindEvents.call(this);
            return this.$el;
		},


		/**
		 * Unset all tab specific events and element displays
		 */
		unset : function() {
			this.$headers.removeClass(this.options.activeClass).removeAttr('role');
			this.$containers.css('height', '').removeAttr('role').removeClass([this.options.activeClass, this.options.inactiveClass, this.options.transitioningClass].join(' '));
			// remove events and data on root element
            this.$el.off('click.' + _namespace);

            if($.support.transition) {
                this.$el.off($.support.transition.end + '.' + _namespace);
            }

            this.$el.removeData(_namespace);
            return this.$el;
		}
	};

	// Plugin declaration/assignment
    g.utilities.plugins.initializer.call(Accordion, _namespace);

	/**
	 * Data api definition/setup/instantiation
	 */
	$(function() {
		$('[data-accordion]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
		});
	});
}).call(window.UiKit, window.jQuery);