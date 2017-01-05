/**
 * UiKit custom-selects.js
 * Copyright 2014 UiKit.
 *
 * Plugin to convert standard form selects
 * into a custom variety.
 *
 * <div class="custom-styled-select">
 <span class="custom-styled-outer"><span class="custom-styled-inner">Text</span></span>
 <select name="some_name">...</select>
 </div>
 */
(function($) {
    "use strict";

    var _namespace = 'CustomSelects',
        g = this;

    /**
     * Builds the necessary markup for the custom selects
     *
     * @private
     */
    function _build() {
        if (this.$housing && this.$housing.length) return false;

        var $housing = $('<div class="custom-styled-select" />'),
            $customStyledSpans = '<span class="outer"><span class="inner">' + this.$el.find(':selected').text() + '</span></span>';

        // Set css props & apply
        $housing.css({
            'display' : 'inline-block',
            'position' : 'relative'
        });

        // Apply spans and then set correct styles on select menu
        this.$el.wrap($housing);
        this.$el.before($customStyledSpans);
        this.$el.css({
            position : 'absolute',
            opacity : 0,
            left : 0,
            top: 0
        }).addClass('styled-select');

        this.$housing = this.$el.parent();
        this.$spanOuter = this.$housing.find('> span');
        this.$spanInner = this.$spanOuter.find('> span');

        // Set css props
        this.$spanOuter.css({display : 'inline-block'});
        this.$spanInner.css({display : 'inline-block'});

        //Custom Options
        if(this.options.customOptions) {
            this.$optionList = $('<ul class="custom-options" />').appendTo(this.$housing.addClass('with-custom-options'));
        }

        _checkProperty.call(this);
        this.$el.trigger('ready.' + _namespace);
        return true;
    }


    /**
     * Checks for disabled or readonly properties on the select
     * menu itself.
     *
     * @private
     */
    function _checkProperty() {
        this.$housing.removeClass('disabled readonly');
        if (this.$el.prop('disabled')) {
            this.$housing.addClass('disabled');
        }

        // handling for disabled selects
        if (this.$el.prop('readonly')) {
            this.$housing.addClass('readonly');
        }
    }


    /**
     * Binds all of the select events
     *
     * @private
     */
    function _bindEvents() {
        var _self = this;
        _self.$el.on('change.' + _namespace, function(e) {
            _self.updateText();

            if(_self.options.customOptions) {
                var $li = _self.$optionList.find('li').eq(_self.$el.find(':selected').index());

                if(_self.$el.data('customKey')) {
                    if($li.length) {
                        _self.scrollToItem($li);
                    }
                    _self.$el.data('customKey', false);
                }

                _self.$optionList.find('.activated').removeClass('activated');
                _self.$optionList.find('.selected').removeClass('selected');
                $li.addClass('selected');
            }
            return true;
        }).on('keyup.' + _namespace, function(e) {
            _self.updateText();
        }).on('focus.' + _namespace, function(e) {
            _self.$housing.addClass('focus');
        }).on('blur.' + _namespace, function(e) {
            _self.$housing.removeClass('focus');

            if(_self.options.customOptions && _self.$spanOuter.hasClass('open')) {
                var closeListFunction = function() {
                    if(_self.$optionList.data('keep-open')) {
                        if(!_self.$optionList.data('scrolling')) {
                            g.utilities.debounce(closeListFunction, 100)();
                        }
                    } else {
                        //e.stopPropagation();
                        _self.$spanOuter.trigger('close.' + _namespace);
                    }
                }
                g.utilities.debounce(closeListFunction, 100)();
            }
        });

        if(this.options.customOptions) {
            _bindOptionsEvents.call(_self);
        }
    }


    function _bindOptionsEvents() {
        var _self = this;
        _self.$el.on('update.' + _namespace, function() {
            _self.update.call(_self);
        }).on('keydown.' + _namespace, function(e) {
            _self.updateSelectionByKeyEvent(e);
        }).trigger('update.' + _namespace);

        //Binding events to each option item
        _self.$optionList.on('mouseenter.' + _namespace, function() {
            $(this).data('keep-open', true);
        }).on('scroll.' + _namespace, function() {
            _self.$optionList.data('scrolling', true);

        }).on('mouseleave.' + _namespace, function() {
            var $list = $(this);

            if($list.data('scrolling')) {
                _self.$el.trigger('focus');
            }
            $(this).data('keep-open', false).data('scrolling', false);
        }).on('click.' + _namespace, 'li', function() {
            var $clicked = $(this);

            _self.$optionList.data('keep-open', false).data('scrolling', true).find('.selected').removeClass('selected');

            _self.$el.val($clicked.addClass('selected').data('raw-value'));
			
			_self.$el.trigger('change');		

            _self.$el.trigger('blur').trigger('focus');
        }).on('mouseenter.' + _namespace, 'li', function() {
            _self.$optionList.find('.activated').removeClass('activated');

            return $(this).addClass('activated');
        }).on('mouseleave.' + _namespace, 'li', function() {
            return _self.$optionList.find('.activated').removeClass('activated');
        });

        // Binding events to the outerSpan as the trigger
        _self.$spanOuter.on('click.' + _namespace, function() {
            var disabled = _self.$el.prop('disabled');

            if (!disabled) {

                _self.$spanOuter.toggleClass('open');
                if(_self.$spanOuter.hasClass('open')) {

/*                    _self.$optionList.slideDown({
                        complete: function() {
                            _self.$optionList.find('.activated').removeClass('activated');
                            _self.scrollToItem.call(_self, _self.$optionList.find('.selected').addClass('activated'));
                        }
                    });*/
                    if ((_self.$housing.offset().top + _self.$housing.outerHeight() + _self.$optionList.outerHeight() + 20) > $(window).height() + $(window).scrollTop()) {
                        _self.$optionList.addClass('overflowing');
                    } else {
                        _self.$optionList.removeClass('overflowing');
                    }

                } else {
                   // _self.$optionList.slideUp();
                }

                _self.$optionList.toggleClass('open');

            }

            _self.$el.trigger('focus.' + _namespace);
        }).on('close.' + _namespace, function(e) {
            _self.$el.data('customed-click', false);
            _self.$spanOuter.removeClass('open');
            _self.$optionList.removeClass('open');
        });
    }

    var CustomSelects = g.CustomSelects = function(el, options) {
        this.$el = $(el);
        this.options = $.extend({}, CustomSelects.defaults, options);
        this.version = "1.1.0"; //@TODO bring this dynamic after encapsulating versions and dependencies using bower
        if(_build.call(this)) {
            _bindEvents.call(this);
        }
    };

    CustomSelects.defaults = {
        customOptions: true
    };

    CustomSelects.prototype = {
        /**
         *
         * @param e
         * @returns {*}
         */
        updateSelectionByKeyEvent: function(e) {
            var _self = this,
                w = e.which,
                $activeOption = _self.$optionList.find('.activated');

            $activeOption.removeClass('activated');

            if (!_self.$optionList.hasClass('open')) {
                if (w === 13 || w === 32 ) {
                    e.preventDefault();
                    return _self.$spanOuter.trigger('click');
                }
            } else {
                if (w === 38) {
                    e.preventDefault();
                    if ($activeOption.length && $activeOption.index() > 0) {
                        $activeOption.prev().addClass('activated');
                    } else {
                        _self.$optionList.find('li:last-child').addClass('activated');
                    }
                } else if (w === 40) {
                    e.preventDefault();
                    if ($activeOption.length && $activeOption.index() < _self.$optionList.find('li').length - 1) {
                        $activeOption.next().addClass('activated');
                    } else {
                        _self.$optionList.find('li:first-child').addClass('activated');
                    }
                } else if (w === 27) {
                    e.preventDefault();
                    _self.$spanOuter.trigger('click');
                } else if (w === 13 || w === 32) {
                    e.preventDefault();
                    $activeOption.trigger('click');
                } else if (w === 9) {
                    if (_self.$spanOuter.hasClass('open')) {
                        _self.$spanOuter.trigger('close.' + _namespace);
                    }
                } else {
                    _self.$el.data('customKey', w);
                }

                _self.scrollToItem(_self.$optionList.find('.activated'));
            }
        },


        scrollToItem: function($toBeActivated) {
            var _self = this;

            if ($toBeActivated.length) {
                var liTopPosition = $toBeActivated.position().top,
                    liHeight = $toBeActivated.outerHeight(),
                    currentListTopPosition = _self.$optionList.scrollTop();

                if(liTopPosition < 0) {
                    _self.$optionList.scrollTop(currentListTopPosition + liTopPosition);
                } else if(liTopPosition + liHeight > _self.$optionList.innerHeight()) {
                    _self.$optionList.scrollTop(currentListTopPosition + liTopPosition + liHeight - _self.$optionList.innerHeight());
                }
            }
        },


        update: function() {
            var _self = this,
                optsHtml = [];

            if(_self.options.customOptions) {
                if(typeof _self.$optionList == 'undefined') {
                    _self.$optionList = $('<ul class="custom-options" />').appendTo(_self.$housing);
                    _bindOptionsEvents.call(_self);
                }
                _self.$housing.addClass('with-custom-options');

                _self.$el.find('option').each(function() {
                    var $op = $(this),
                        opAttributes,
                        ndx,
                        $li = $('<li />');


                    if($op.prop('selected')) {
                        $li.addClass("selected activated");
                    }
                    if($op.val()) {
                        $li.attr('data-raw-value', $op.val());
                    }
                    
/*
                    for(ndx = 0; ndx < opAttributes.length; ndx++) {
                        var attrName = opAttributes[ndx].name;
                        if(attrName !== 'selected' && attrName !== 'value') {
                            if(attrName.indexOf('data') == 0) {
                                $op.attr(attrName, op.getAttribute(attrName));
                            } else {
                                $op.addClass(attrName + "-" +  op.getAttribute(attrName));
                            }
                        }
                    }
*/
                    

                    optsHtml.push($li.text($op.text()).get(0).outerHTML);
                });


                _self.$optionList.html(optsHtml.join(''));
            } else {
                if(typeof _self.$optionList != 'undefined') {
                    _self.$optionList.empty();
                }
                _self.$housing.removeClass('with-custom-options');
            }
            _self.updateText();
        },


        updateText : function() {
            this.$spanInner.text(this.$el.find(':selected').text());
            _checkProperty.call(this);
        },


        select: function(value) {
            if(typeof value == 'object') {
                value = value.value;
            }

            this.$el.val(value);

            //Custom Options
            if(this.options.customOptions) {
                this.update();
            } else {
                this.updateText();
            }

        },


        insert: function(option) {
            var value = option,
                label = option;
            if(typeof option == 'object') {
                if(!option.hasOwnProperty('label') && !option.hasOwnProperty('value')) {
                    throw 'You cannot insert an option without label nor value';
                }

                value = option.value || option.label;
                label = option.label || option.value;
            }

            this.$el.append('<option value="{value}">{label}</option>'.replace('{label}', label).replace('{value}',value));

            //Custom Options
            if(this.options.customOptions) {
                this.update();
            } else {
                this.updateText();
            }
        },


        show : function() {
            if(typeof this.$housing !== 'undefined') {
                this.$housing.css({
                    'display' : 'inline-block'
                });
            }
        },


        hide : function() {
            if(typeof this.$housing !== 'undefined') {
                //this.$housing.hide();
            }
        },


        /**
         * Resets the additional markup back to factory defaults
         */
        reset : function(newOptions) {
            this.unset();

            if(typeof newOptions !== 'undefined') {
                this.options = newOptions;
            }
            if(_build.call(this)) {
                _bindEvents.call(this);
            }
        },


        /**
         * Removes all markup injected
         */
        unset : function() {
            if (!this.$el.hasClass('styled-select')) {
                return;
            }

            if(this.options.customOptions) {
                this.$housing.off('.' + _namespace);
                this.$spanOuter.off('.' + _namespace);
            }

            var $select = this.$el.removeClass('styled-select')
                .attr('style', '')
                .off('.' + _namespace);
            this.$housing.before($select).remove();

            // clear out object data
            this.$housing = null;
            this.$spanOuter = null;
            this.$spanInner = null;

            this.$el.removeData(_namespace);
        },


        respond: function() {
            return this;
        }
    };


    // Plugin declaration/assignment
    g.utilities.plugins.initializer.call(CustomSelects, _namespace);

    $(function() {
        /**
         * Each element containing the attribute data-custom-selects will be bound to specific actions:
         *
         * If the attribute is empty or is not defined like in
         * <select id="#selectDemo" data-custom-selects></select> then we initialize the custom select on that element.
         *
         * If the attribute contains an string, this will map an specific action like in:
         * <button data-custom-selects="select" data-target="#selectDemo" data-value="0" /> then we execute:
         * $("#selectDemo").CustomSelects('select', "0");
         */
        $('[data-custom-selects]').each(function() {
            g.utilities.plugins.dataBinder.call(this, _namespace);
        });
    });

}).call(window.UiKit, window.jQuery);
