/**
 * UiKit Modal.js
 * Version: 2.2.0
 *
 * Copyright {{YEAR}} UiKit.
 */
(function($) {

	var _namespace = 'Modal',
        g = this;

    /**
     * Bind necessary events
     * @private
     */
    function _bindEvents() {
        var _self = this;
        // Hide Modal on click of backdrop
        this.$el.on('click.' + _namespace + ' touch.' + _namespace, function(e) {
            if(e.target === e.currentTarget) {
                _self.$el.Modal('hide');
            }
        });
    }

    var Modal = g.Modal = function(element, options) {
        this.$el = $(element);
		this.options = options;
        this.version = "2.2.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower
        this.active = false;

        _bindEvents.call(this);
        return this;
    };

    Modal.defaults = {
		transitionSpeed :400,
        activeClassName: g.hasOwnProperty('utilities') ? g.utilities.activeClass : 'ui-active'
	};

    //setup some methods
    Modal.prototype = {
        toggle : function() {
            return this.active ? this.hide() : this.show();
        },
        show: function() {
			var _self = this;

			// handle css transition redraw
            this.$el.get(0).style.display = "block";


            //We need to touch the offsetWidth attribute of the DOM element to initialize the transition
            if($.support.transition && this.$el.get(0).offsetWidth) {
                this.$el.addClass(this.options.activeClassName);
				// transition callback
				this.$el.one($.support.transition.end, function() {
					_self.active = true;
					_self.$el.trigger('shown.' + _namespace);
				}).emulateTransitionEnd(this.options.transitionSpeed);
			} else {
                this.$el.addClass(this.options.activeClassName);
				this.active = true;
				this.$el.trigger('shown.' + _namespace);
			}
            return _self.$el;
		},

        hide: function() {
            var _self = this;

            this.$el.removeClass(this.options.activeClassName);

			if ($.support.transition) {
				// transition callback
				this.$el.one($.support.transition.end, function(){
					_self.$el.hide();
					_self.active = false;
					_self.$el.trigger('hidden.' + _namespace);
				})
				.emulateTransitionEnd(this.options.transitionSpeed);
			} else {
				this.$el.hide();
				this.active = false;
				this.$el.trigger('hidden.' + _namespace);
			}
            return _self.$el;
        }
    };

    //setup jquery plugin $.Modal
    g.utilities.plugins.initializer.call(Modal, _namespace);

	$(function() {
        $('[data-modal]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
	});

}).call(UiKit, window.jQuery);