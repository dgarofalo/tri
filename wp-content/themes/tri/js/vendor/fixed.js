/**
 * UiKit fixed.js
 * Version: 1.1.0
 * Copyright 2015 UiKit.
 */
(function($) {
	"use strict";

	var _namespace = 'Fixed',
        g = this;


    /**
     * Binds events to elements
     *
     * @private
     */
    function _bindEvents() {
        var _self = this;

        // Bind to window scrolling event
        $(window).on('scroll.' + _namespace, g.utilities.throttle(function (e) {
            _self.fix($(this).scrollTop());

            _self.contentHeight = _self.$content.outerHeight(true);
            _self.containerHeight = _self.$el.outerHeight(true);
        }, 60));

        $(window).on('resize.' + _namespace, g.utilities.throttle(function(e) {
            _self.options.threshold = _self.options.threshold || (_self.$content.offset().top - parseFloat(_self.$content.css('marginTop').replace(/auto/, 0)));
            _self.containerHeight = parseInt(_self.$el.css('height'));
            _self.contentHeight = _self.$content.outerHeight(true);
        }, 100));
    }


	/**
	 * Constructor method
	 */
	var Fixed = g.Fixed = function(el, options) {
		this.$el = $(el).addClass('fixed-wrapper');
		this.options = $.extend({}, Fixed.defaults, options);
        this.version = "1.1.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower
		this.$content = this.$el.find(this.options.content);

		// threshold for when to begin being fixed
		this.options.threshold = this.options.threshold || (this.$content.offset().top - parseFloat(this.$content.css('marginTop').replace(/auto/, 0)));

		// following variables are used to define when the content hits the floor.
		this.containerHeight = this.$el.outerHeight(true);
		this.contentHeight = this.$content.outerHeight(true);

		if(typeof this.options.fix == 'function') {
            this.fix = this.options.fix;
        }

		this.fix($(window).scrollTop());
		_bindEvents.call(this);
		return this;
	};


	Fixed.defaults = {
		content: '.fixed-content',
		threshold: null,
		fix: null
	};


	Fixed.prototype = {
        /**
         *
         * @param y the top position of the window scroll
         * @returns {jQuery} the $el element bound to the Fixed nstance
         */
		fix: function(y) {
			/**
			 * 1. check if hitting the floor
			 * 2. check if fixed
			 * 3. move on
			 */
			if ((y >= (this.options.threshold + this.containerHeight) - this.contentHeight)) {
				this.$content.addClass('floored')
			} else if (y >= this.options.threshold) {
				this.$content.addClass('fixed')
			}else{
				this.$content.removeClass('fixed floored');
			}
            return this.$el;
		},


		/**
		 * Resets fixed back to initial state
		 */
		reset : function() {
			this.unset();
			_bindEvents.call(this);
			this.fix($(window).scrollTop());

            return this.$el;
		},


		/**
		 * Unset all events and defined styles
		 */
		unset : function() {
			this.$content.removeClass('fixed floored');
            this.$el.removeClass('fixed-wrapper');
			$(window).off('.' + _namespace);

            this.$el.removeData(_namespace);
            return this.$el;
		},


		/**
		 * Unsets fixed positioning for responsive
		 */
		respond : function(options) {
			return this.unset();
		}
	};

	// Plugin declaration/assignment
    g.utilities.plugins.initializer.call(Fixed, _namespace);

    $(function() {
        /**
         * Each element containing the attribute data-fixed will be bound to specific actions:
         *
         * If the attribute is empty or is not defined like in
         * <div id="#wrapperDemo" data-fixed></div> then we initialize the fixed element on #wrapperDemo.
         *
         * If the attribute contains an string, this will map an specific action like in:
         * <button data-fixed="fix" data-target="#selectDemo" data-value="0" /> then we execute:
         * $("#selectDemo").CustomSelects('select', "0");
         */
        $('[data-fixed]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
    });
}).call(window.UiKit, window.jQuery);
