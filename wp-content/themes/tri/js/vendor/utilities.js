// Create UiKit object in global name space to pass into closure
if (typeof UiKit === 'undefined') {
	var UiKit = {};
}

/**
 * UiKit Utilities/helper methods
 *
 * @param this | window.UiKit object
 * @param $ | window.jQuery object
 */
(function($) {
	this.utilities = {

		$globalMsgs : $('#global-messages'),
        /**
         * UiKit standard plugin classes
         */
        activeClass: 'ui-active',
        inactiveClass: 'ui-inactive',
        transitioningClass: 'ui-transitioning',
        plugins: {
            initializer: function(_namespace) {
                $.fn[_namespace] = function(option) {
                    if (!UiKit.hasOwnProperty(_namespace)) throw "The UiKit " + _namespace + " plugin is not defined in the UiKit namespace.";

                    var args = Array.prototype.slice.call(arguments, 1),
                        initialize = function (i, el) {
                            var $el = $(el),
                                plugin = $el.data(_namespace),
                                options,
                                isInitialized = false;

                            if (!plugin && (!$el.is(':visible') && $el.data('force') !== true || $el.hasClass('ignore')) && _namespace != 'Modal' && _namespace != 'Tipsy') {
                                return el;
                            }

                            //check for existing data
                            if (!plugin) {
                                isInitialized = true;
                                options = $.extend({}, UiKit[_namespace].defaults, typeof option === 'object' ? option : {});
                                plugin = new UiKit[_namespace](el, options);
                                $el.data(_namespace, plugin);
                            }


                            if(typeof option != 'undefined' && typeof option === 'string') {
                                //we can pass in a string that triggers a method
                                if (plugin[option]) {
                                    return typeof plugin[option] === 'function' ? plugin[option].apply(plugin, args) : plugin[option];
                                } else if (!isInitialized) {
                                    console.error('The ' + option + ' method is not supported.');
                                }
                            }
                            return el;
                        };

                    return this.map(initialize);
                }
            },
            /**
             * Data API definition/setup/instantiation for all our UiKit Plugins.
             *
             * @param _namespace
             */
            dataBinder: function(_namespace) {
                var options = {},
                    $obj = $(this),
                    opt;

                if($obj.data(_namespace.toSnakeCase())) {
                    $obj.on('click.' + _namespace + ' touch.' + _namespace, function(e) {
                        var $target = $($obj.data('target') || $obj.attr('href'));

                        $target[_namespace].apply($target, [$obj.data(_namespace.toSnakeCase()), $obj.data()]);

                        if($obj.is('a') || $obj.is('button')) e.preventDefault();
                    });
                } else {
                    for (opt in UiKit[_namespace].defaults) {
                        if(UiKit[_namespace].defaults.hasOwnProperty(opt) && $obj.data()[opt]) {
                            options[opt] = $obj.data(opt);
                        }
                    }
                    $obj[_namespace](options);
                }
            }
        },

        /**
         * Adds an error message
         *
         * @param msg
         * @param append
         */
        addError : function(msg, append) {
            this.addMessage('error', msg, append);
        },
        /**
         * Adds a message to the global messages area. Has option to append or just overwrite.
         * This shortcut methods for this method implementations can be found in:
         *
         * - UiKit.utilities.addError
         * - UiKit.utilities.addSuccess
         *
         * @param type String
         * @param msg String
         * @param append boolean
         */
        addMessage : function(type, msg, append, $altMsgContainer) {
            var $msgsCntr = ($altMsgContainer) ? $altMsgContainer : this.$globalMsgs;
            append || (append = false);
            switch(type) {
                case "success":
                    // build classes and markup
                    var message = '<li class="success-msg"><ul><li>' + msg +'</li></ul></li>';
                    if (append) {
                        var $appendTo = $msgsCntr.find('.messages li').filter(':last-child');
                    }
                    break;
                case "error":
                    // build classes and markup
                    var message = '<li class="error-msg"><ul><li>' + msg +'</li></ul></li>';
                    if (append) {
                        var $appendTo = $msgsCntr.find('.messages li').filter(':last-child');
                    }
                    break;
                default:
                    var message = '<li class="note-msg"><ul><li>' + msg +'</li></ul></li>';
                    if (append) {
                        var $appendTo = $msgsCntr.find('.messages li').filter(':last-child');
                    }
                    break;
            }

            // if set to append, lets append it to the correct ul list else replace html with new messages
            if (append) {
                if ($appendTo.length) {
                    $appendTo.after(message);
                } else {
                    $msgsCntr.append('<ul class="messages">' + message + '</ul>');
                }
            } else {
                $msgsCntr.html('<ul class="messages">' + message + '</ul>');
            }
            // append to where the messages belong.
        },
        /**
         * Adds a group of messages formatted in a json object/array
         *
         * @param msgs
         * @returns {string}
         */
        addMessages: function(msgs, type){
            type || (type = 'error');
            this.clearMessages();
            if (msgs instanceof Array) {
                for (var i = 0; i < msgs.length; i++) {
                    this.addMessage(type, msgs[i], true);
                }
            } else {
                this.addMessage(type, msgs, true);
            }
        },
        /**
         * Adds a success message
         *
         * @param msg {String} the message
         * @param append {boolean}
         */
        addSuccess : function(msg, append) {
            this.addMessage('success', msg, append);
        },
        /**
         * Checks a transition support and handles triggering events and callbacks.
         * This method is actually not mandatory for all transition attributes.  In some cases like height, we
         * just need to touch attributes in certain elements to trigger a repaint in the DOM so the transition event is
         * executed after.
         *
         * @param $el
         * @param event
         * @param data {Object} A Plain Object with extra information to send to the event.  transitionSpeed attribute will specify the actual event delay.
         * @param fn
         */
        checkTransition: function($el, event, data, fn) {
            if ($.support.transition) {
                $el.one($.support.transition.end, function(e) {
                    if(typeof fn === 'function') {
                        fn();
                    }
                    $el.trigger({type: event, extra: data});
                });
            }
            else {
                if(typeof fn === 'function') {
                    fn();
                }
                $el.trigger({type: event, extra: data});
            }
        },
        /**
         * Clears the Global Messages
         */
        clearMessages : function() {
            this.$globalMsgs.html('');
        },
        /**
         * Debounce method allows a callback to be passed in to
         * run at the completion of a burst of events (such as
         * keyup)
         *
         * @param fn
         * @param delay
         * @returns {Function}
         */
        debounce : function(fn, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        },
        /**
         * Scrolls to a specific object in the DOM
         *
         * @param $container
         * @param extras
         * @param duration
         */
        scrollTo : function($container, extras, duration) {
            var check = false,
                threshold = 0;

            if (typeof extras === 'object') {
                check = extras.check || check;
                threshold = extras.threshold || threshold;
            } else {
                check = extras
            }
            duration || (duration = 500);
            if (!check || (check && ($container.offset().top - threshold) < window.scrollY)) {
                $('html, body').animate({scrollTop : ($container.offset().top - threshold)}, duration);
            }
        },
		/**
		 * Throttling function callbacks to fire at a given timeout.
		 * Useful for event tracking (such as scrolling or resizing)
		 * to prevent firing callback every 1ms.
		 *
		 * @param fn
		 * @param threshold
		 * @param scope
		 * @returns {Function}
		 */
		throttle : function(fn, threshold, scope) {
			var last, deferTimer;
			threshold || (threshold = 250);
			return function() {
				var context = scope || this;
				var now = +new Date, args = arguments;

				if (last && now < last + threshold) {
					// hold on to it
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, threshold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
		}
	};
}).call(UiKit, window.jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

+function ($) {
	"use strict";

	// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
	// ============================================================

	function transitionEnd() {
		var el = document.createElement('bootstrap')

		var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd otransitionend',
			'transition': 'transitionend'
		}

		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return { end: transEndEventNames[name] }
			}
		}
	}

	// http://blog.alexmaccaw.com/css-transitions
	$.fn.emulateTransitionEnd = function (duration) {
		var called = false,
            $el = this,
            callback = function () {
                if (!called) {
                    $($el).trigger($.support.transition.end);
                }
            };

		$(this).one($.support.transition.end, function () {
			called = true;
		});
		setTimeout(callback, duration);
		return this
	}

	$(function () {
		$.support.transition = transitionEnd()
	})

}(window.jQuery);

String.prototype.toSnakeCase = function() {
    var str = this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
    return str.charAt(0) === '-' ? str.substring(1) : str;
};