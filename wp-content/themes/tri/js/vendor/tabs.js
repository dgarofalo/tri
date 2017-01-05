;
/**
 * UiKit Tabs.js
 * Version: 1.1.0
 *
 * Copyright {{YEAR}} UiKit.
 */
(function($) {
    "use strict";

	var _namespace = 'Tabs',
        g = this;


    /**
     * Performs all the even binding on the current $el widget, for transitions, clicks, be it direct or delegated
     *
     * @private
     */
    function _bindEvents() {
        var _self = this;
        this.$el.on('click.' + _namespace, this.options.tabs, function(e) {
            _self.reveal($(this));
            e.preventDefault();
        });

        if ($.support.transition) {
            this.$el.on($.support.transition.end + '.' + _namespace, this.options.containers, function(e) {
                var elm = e.target,
                    className = _self.options.containers.substring(1);

                if($(elm).hasClass(className)){
                    _afterTransition(_self, elm);
                }
            });
        }
    }


    /**
     * Executes what is needed to execute after a tab is revealed whether transitionEnd is supported or not,
     *
     * @param _self the current tabs instance
     * @param target the tabPanel element where the transition is supposed to apply
     * @private
     */
    function _afterTransition(_self, target) {
        if(_self.busy) {
            _self.busy = false;
            _self.$el.trigger('active.' + _namespace, {tabpanel: target});
        }
        $(target).removeClass(_self.options.transitioningClass).attr('aria-expanded',true);
    }


    /**
     * Returns the proper jQuery object by an object reference, the same jQuery identity or the index in number or string
     *
     * @param $t {object|number|string} the param reference of the header
     * @return {object} the jQuery object wrapping the param reference
     * @private
     */
    function _getTabReference($t) {
        if(typeof $t == 'string') {
            $t = parseInt($t);
        }
        if(typeof $t == 'number' && !isNaN($t)) {
            $t = this.$tabs.eq($t);
        }
        if(typeof $t == 'object' && !$t['jquery'] && $t.hasOwnProperty('index')) {
            $t = this.$tabs.eq($t['index']);
        }
        return $t;
    }


	/**
	 * Constructor
	 */
	var Tabs = g.Tabs = function(el, options) {
		this.$el = $(el);
        this.options = $.extend({}, Tabs.defaults, options);
        this.version = "1.1.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower

		this.$tabs = this.$el.find(this.options.tabs).attr('role','tab').attr('aria-expanded', false);
		this.$containers = this.$el.find(this.options.containers).attr('role','tabpanel').attr('aria-expanded',false);
		this.busy = false;

		_bindEvents.call(this);

		this.reveal(this.$tabs.eq(this.options.defaultTab));

		// set data on the object
		this.$el.trigger('ready.' + _namespace);
        return this;
	};


	// Option defaults
	Tabs.defaults = {
		'tabs' : '.tabs-tab',
		'containers' : '.tabs-content',
		'defaultTab': 0,
		'transitionSpeed' : 500,
        'activeClass' : g.hasOwnProperty('utilities') ? g.utilities.activeClass : 'ui-active',
        'inactiveClass' : g.hasOwnProperty('utilities') ? g.utilities.inactiveClass : 'ui-inactive',
        'transitioningClass' : g.hasOwnProperty('utilities') ? g.utilities.transitioningClass : 'ui-transitioning'
	};


	Tabs.prototype = {
		/**
		 * Reveals the active tab based on the tab object
		 * passed in. This works off of the following ways:
		 * 	- data-tabs-target
		 * 	- href
		 *
		 * 	@Param $tab jQuery | integer indicating the index of the tab in the container
		 */
		reveal : function($tab) {
            var _self = this,
                $_content,
                $_inactiveTabPanel;

            $tab = _getTabReference.call(_self, $tab);

			if ($tab.hasClass('active') || this.busy || !$tab.attr('aria-controls')) return _self.$el;

            _self.busy = true;
            _self.$tabs.removeClass(_self.options.activeClass).filter('[aria-expanded=true]').attr('aria-expanded', false);

            $_inactiveTabPanel = _self.$containers.filter('[aria-expanded=true]');

            if($_inactiveTabPanel.length) {
                $_inactiveTabPanel.removeClass(_self.options.activeClass).attr('aria-expanded', false).css('display','');
                _self.$el.trigger('inactive.' + _namespace, {tabpanel: $_inactiveTabPanel.get(0), tab: $tab.get(0)});
            }

            $_content = _self.$el.find('#' + $tab.attr('aria-controls')).css('display', 'block');

			if($.support.transition) {
                $_content.get(0).offsetWidth;
            }

			$tab.addClass(_self.options.activeClass).attr('aria-expanded', true);
            $_content.addClass([_self.options.activeClass, _self.options.transitioningClass].join(' '));

            if (!$.support.transition) {
                _afterTransition(_self, $_content.get(0));
            }
            return _self.$el;
		},


		/**
		 * Resets tabs back to initial state
		 */
		reset : function() {
			this.unset();

            _bindEvents.call(this);

			this.reveal(this.$tabs.eq(this.options.defaultTab));
            return this.$el;
		},


		/**
		 * Unset all tab specific events and element displays
		 */
		unset : function() {
			this.$tabs.css('display', '').removeClass(this.options.activeClass).removeAttr('role').removeAttr('aria-expanded');
			this.$containers.css('display', '').removeClass([this.options.activeClass, this.options.transitioningClass].join(' ')).removeAttr('role').removeAttr('aria-expanded');
			// remove events and data on root element
			this.$el.off('click.' + _namespace);
            if($.support.transition) {
                this.$el.off($.support.transition + '.' + _namespace);
            }
            this.$el.removeData(_namespace);
            return this.$el;
		}
	};

    // Plugin declaration/assignment
    g.utilities.plugins.initializer.call(Tabs, _namespace);


    /**
     * Data api definition/setup/instantiation
     */
    $(function() {
        /**
         * Each element containing the attribute data-tabs will be bound to specific actions:
         *
         * If the attribute is empty or is not defined like in
         * <div id="#tabs1" class="tabs" data-tabs></div> then we initialize the tabs and the tab panels over that element.
         *
         * If the attribute contains an string, this will map an specific action like in:
         * <button data-tabs="reveal" data-target="#tabs1" data-index="0" /> then we execute:
         * $("#tabs1").Tabs('reveal', 0);
         */
        $('[data-tabs]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
    });

}).call(window.UiKit, window.jQuery);


