(function($) {
    "use strict";

    var _namespace = 'CustomFileInputs',
        g = this;


    var CustomFileInputs = g.CustomFileInputs = function(el, options) {
        this.$el = $(el);
        this.options = $.extend({}, CustomFileInputs.defaults, options);;
        this.version = "1.0.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower

        this._bindEvents();
    };

    CustomFileInputs.defaults = {};

    CustomFileInputs.prototype = {
        /**
         * Binds all of the input events
         *
         * @private
         */
        _bindEvents: function() {
            var _self = this,
                $housing = $('<div class="custom-styled-input" />'),
                $housingInner = '<span class="label">' + this.$el.data('placeholder') + '</span><span class="file-name">No File Chosen</span> ';

            this.$el.wrap($housing);
            this.$el.before($housingInner);
            this.$housing = this.$el.parent();
            this.$label = this.$housing.find('.label');
            this.$fileName = this.$housing.find('.file-name');


            this.$el.on('change.' + _namespace, function(e) {
                var $this = $(this);
                var value = $this.val().replace(/^.*[\\\/]/, ''); //simplify file name

                if (value) {
                    _self.$fileName.text(value);
                } else {
                    _self.$fileName.text('No File Chosen');
                }
            });
        },

        /**
         * Resets the additional markup back to factory defaults
         */
        reset : function() {
            this.unset();
            this._bindEvents();
        },

        /**
         * Removes all markup injected
         * @todo - test this
         */
        unset : function() {
            this.$el.off('.' + _namespace);
        },

        respond: function() {
            return this;
        }
    };


    // Plugin declaration/assignment
    g.utilities.plugins.initializer.call(CustomFileInputs, _namespace);

}).call(window.UiKit, window.jQuery);