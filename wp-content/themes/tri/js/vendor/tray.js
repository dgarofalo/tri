(function($) {
    "use strict";

    var _namespace = 'Tray',
        g = this;


    /**
     *  Binds necessary events
     * @private
     */
    function _bindEvents() {
        var _self = this;

        // Bind close to shade
        _self.$shadeSelector.on('click.' + _namespace + ' touch.' + _namespace, function(e){
            var $openNav = $('.' + _namespace.toLowerCase() + '.' +  _self.options.activeClassName);

            if($openNav.length > 0){
                _self.close($openNav);
            }
        });
    }

    /**
     * Displays the shade element (if available)
     * @private
     */
    function _showShade() {
        if(this.$shadeSelector.length) {
            this.$shadeSelector.addClass(this.options.activeClassName);
        }
    }

    /**
     * Hides the shade element (if available)
     * @private
     */
    function _hideShade() {
        if(this.$shadeSelector.length) {
            this.$shadeSelector.removeClass(this.options.activeClassName);
        }
    }

    var Tray = g.Tray = function(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = $.extend({}, Tray.defaults, options);
        this.version = "1.0.0";

        this.$shadeSelector = $(this.options.shadeSelector);

        // Init
        this.$el.addClass(_namespace.toLowerCase());
        _bindEvents.call(this);

        this.$el.trigger('ready.' + _namespace);
    };

    Tray.defaults = {
        shadeSelector : '#shade',
        addBodyClass :  true,
        activeClassName: g.utilities.activeClass
    };

    Tray.prototype = {

        toggle: function(){
            var _self = this;

            if(_self.busy){
                return _self.$el;
            }

            if(_self.$el.hasClass(_self.options.activeClassName)){
                _self.close();
            }else{
                _self.open();
            }
        },

        /**
         * Opens the tray instance
         * @returns {*|jQuery|HTMLElement}
         */
        open : function(){
            var _self = this;

            if(this.busy){
                return _self.$el;
            }

            this.busy = true;

            this.$el.addClass(_self.options.activeClassName);
            this.$el.trigger({type: 'open.' + _namespace, extra: {}});
            _showShade.apply(this);

            if(this.options.addBodyClass) {
                $('html').addClass(_namespace.toLowerCase()).addClass(this.options.activeClassName);
            }

            g.utilities.checkTransition(this.$el, 'opened.' + _namespace, {}, function() {
                _self.busy = false;
            });

            return this.$el;
        },


        /**
         * Closes the tray instance
         * @param $element
         * @returns {*|jQuery|HTMLElement}
         */
        close : function(){
            var _self = this;

            if(this.busy){
                return this.$el;
            }

            this.busy = true;

            this.$el.removeClass(_self.options.activeClassName);
            this.$el.trigger({type: 'close.' + _namespace, extra: {}});
            _hideShade.apply(this);

            if(this.options.addBodyClass) {
                $('html').removeClass(_namespace.toLowerCase()).removeClass(this.options.activeClassName);
            }

            g.utilities.checkTransition(_self.$el, 'closed.' + _namespace, {}, function() {
                _self.busy = false;
            });

            return this.$el;
        },


        /**
         * Unsets the tray instance
         * @returns {*|jQuery|HTMLElement}
         */
        unset : function(){
            var data = this.$el.data(_namespace);

            if(!data){
                return this.$el;
            }

            this.busy = false;

            this.el.style.display = '';
            _hideShade.apply(this);

            if(this.options.addBodyClass) {
                $('html').removeClass(_namespace.toLowerCase()).removeClass(this.options.activeClassName);
            }

            this.$el.removeData(_namespace).removeClass('ui-' + _namespace.toLowerCase());

            return this.$el;
        },


        /**
         * Resets the tray instance
         * @returns {*|jQuery|HTMLElement}
         */
        reset : function(){
            if(!this.$el.data(_namespace)) {
                this.unset();
                _bindEvents.call(this);
                return this.$el;
            }
        }
    };

    // Plugin declaration/assignment
    g.utilities.plugins.initializer.call(Tray, _namespace);


    // Data API definition/setup/instantiation

    $(function() {
        $('[data-tray]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
    });

}).call(window.UiKit, window.jQuery);