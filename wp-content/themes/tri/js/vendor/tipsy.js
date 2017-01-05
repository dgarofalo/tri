/**
 * Tipsy, the tool tip plugin.
 * Works in following scenarios/use-cases:
 *     1) Standard tool tip displayed on hover - use css to style out
 *     2) Standard tool tip displayed on hover and follows
 *     3) Tool tip that needs to fit in an area with left/right bounds
 *
 *     Call jQuery('#my-div').Tipsy();
 *
 */
(function ($) {
    "use strict";

    var _namespace = 'Tipsy',
        g = this;


    /**
     * Binds events to objects for hover states and if there is responsive needs.
     * @private
     */
    function _bindEvents() {
        var _self = this;

        // @todo - could we possibly integrate HI?
        this.$el.on('mouseenter.' + _namespace, function(e) {
                _self.show(e, $(this));
            })
            .on('mouseleave.' + _namespace, function(e) {
                _self.hide($(this));
            });
    }


    /**
     * Initializes the bound widths/area for tool tip detection.
     */
    function _setBounds() {
        this.bounds = {
            width: this.$viewport.width(),
            height: $(window).height()
        };
        this.bounds.left = this.bounds.width / 2;
        this.bounds.top = this.bounds.height / 2;
    }

    var Tipsy = this.Tipsy = function(el, options) {
        this.$el = $(el);
        this.options = $.extend({}, Tipsy.defaults, options);
        this.version = "1.1.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower

		// define the view port to track in
		if (this.options.bounds.length > 0) {
			this.$viewport = this.options.bounds;
		} else {    // Default in case the bounds attribute is not set properly
			this.$viewport = !$(window).onmousemove ? $(document) : $(window);    // Detect for ie
		}

        _bindEvents.call(this);
		_setBounds.call(this);
		this.options.onReadyCallback(this);
    };


	/**
     * Default configurable values append to the plugin once bound to an element
     */
    Tipsy.defaults = {
        tip : '.tipsy',
		classes : 'left right top bottom'.split(' '),
		bounds : $('body'),
		transitionSpeed : 300,
		onReadyCallback: $.noop,
        follow: false
    };


    Tipsy.prototype = {
        namespace : _namespace,

		getPosition : function(coords) {
			var position = "";
			if (coords.left < this.bounds.left) {
                position = 'left';
            } else {
                position = 'right';
            }

			if (coords.top > this.bounds.top) {
				position += ' top'
			} else {
				position += ' bottom'
			}

			return position;
		},


		/**
		 * Handle all of the "follow" logic
		 */
		_follow: function($trigger, $tip, tipOffsetTop) {
			var _self = this,
				$bindTo = !$(window).onmousemove ? $(document) : $(window);    // Detect for ie
			$bindTo.on('mousemove.' + _namespace, function(e) {
				var left = (e.pageX - parseInt($trigger.offset().left)),
					top = (e.pageY - parseInt($trigger.offset().top));
				if (left < 0 || left > $trigger.outerWidth(true) || top < 0 || top > $trigger.outerHeight(true)) {
					_self.hide($trigger);
					return;
				}

				$tip.css({'left' : left, 'top' : top})
					.removeClass(_self.options.classes.join(' '))
					.addClass(_self.getPosition({
						left: left,
						top: (tipOffsetTop - $(window).scrollTop())
					}));
			});
		},


        /**
         * Shows the tool tip
         *
         * @param e Event
         * @param $trigger jQuery Object
         */
        show : function(e, $trigger) {
            _setBounds.call(this);	// set the bounds first thing

            var _self = this,
                $tip = $trigger.find(_self.options.tip),
				tipOffsetTop = $trigger.offset().top,
            	position = this.getPosition({
					left: (e.pageX - _self.$viewport.offset().left),
					top: (tipOffsetTop - $(window).scrollTop())
				});

			// if data-tipsy-use-title is set and there is a title set
			if ($trigger.data('tipsyUseTitle') && $trigger.prop('title')) {
				$trigger.after('<div class="tipsy-title">' + $trigger.prop('title') + '</div>');
				$tip = $trigger.next();
			}

			// if data-tipsy-follow is set
            if (_self.options.follow) {
                this._follow($trigger, $tip, tipOffsetTop);
            }

			// Begin transitions
            $tip.removeClass(_self.options.classes.join(' ')).show();
			if ($.support.transition) {
				$tip[0].offsetWidth;
			}
			$tip.addClass(position + ' show');

			// Transition callback
            // @todo: Leverage UiKit.utilities.checkTransition()
			if ($.support.transition) {
				$tip.one($.support.transition.end,function(e) {
					$tip.trigger({
						type : 'shown.' + _namespace,
						eData : {
							tip: $tip,
							trigger: $trigger
						}
					});
				})
				.emulateTransitionEnd(+_self.transitionSpeed + 100);
			} else {
				$tip.trigger({
					type : 'shown.' + _namespace,
					eData : {
						tip: $tip,
						trigger: $trigger
					}
				});
			}
            return this.$el;
        },


        /**
         * Closes the tool tip display
         *
         * @param $trigger jQuery Object
         */
        hide : function($trigger) {
            var _self = this,
                $tip = $trigger.find(_self.options.tip);

			if ($trigger.data('tipsyUseTitle') && $trigger.prop('title')) {
				$tip = $trigger.next();
			}

            if ($tip.data('tipsyFollow')) {
                (!$(window).onmousemove ? $(document) : $(window)).off('mousemove.' + _namespace);
            }

			$tip.removeClass('show');

			// Transition callback
            // @todo: Leverage UiKit.utilities.checkTransition()
			if ($.support.transition) {
				$tip.one($.support.transition.end, function(e) {
					$tip.hide().removeClass(_self.options.classes.join(' '));
					$trigger.data('tipsyUseTitle') && $trigger.prop('title') && $tip.remove();
					$tip.trigger({
						type : 'hidden.' + _namespace,
						eData : {
							tip: $tip,
							trigger: $trigger
						}
					});
				})
				.emulateTransitionEnd(_self.options.transitionSpeed + 100);
			} else {
				$tip.hide().removeClass(_self.options.classes.join(' '));
				$trigger.data('tipsyUseTitle') && $trigger.prop('title') && $tip.remove();
				$tip.trigger({
					type : 'hidden.' + _namespace,
					eData : {
						tip: $tip,
						trigger: $trigger
					}
				});
			}
        },


        /**
         * Unsets all bound events
         */
        unset : function() {
            this.$el.off('.' + _namespace);
            this.$el.removeData(_namespace);

            if (this.$el.data('tipsyFollow')) {
                // Detect where mouse move is bound to unbind event (for ie)
                (!$(window).onmousemove ? $(document) : $(window)).off('mousemove.' + _namespace);
            }
        },


        /**
         * Resets the plugin functionality back to square one
         */
        reset : function() {
            this.unset();
            _bindEvents(this);
            _setBounds.call(this);
        },


        /**
         * Handles any respond needs
         */
        respond : function() {
            return this;
        }
    };


    // Plugin declaration/assignment
    g.utilities.plugins.initializer.call(Tipsy, _namespace);

    /**
     * Data api definition/setup/instantiation
     */
    $(function() {
        $('[data-tipsy]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
    });

}).call(window.UiKit, window.jQuery);
