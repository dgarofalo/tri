(function($) {


    // Readied
    $(function() {

        if(($lazy = $('.ui-lazy')).length) {
            $lazy.unveil()
        }

        if(($select = $('select')).length){
            $select.CustomSelects();
        }

        // Carousel
        if(($carousel = $('.ui-carousel')).length){
            $carousel.owlCarousel({
                items: 1,
                singleItem: true,
                pagination : false,
                navigation : true,
                navigationText : [
                    '<button type="button" class="button"><span class="sr-only">Previous Slide</span><i class="icon-angle-left"></i></button>',
                    '<button type="button" class="button"><span class="sr-only">Next Slide</span><i class="icon-angle-right"></i></button>'
                ],
                baseClass : "ui-carousel",
                theme : "",
                addClassActive : true,
                mouseDrag : false,
                transitionStyle : "fade",
                afterInit : function($elm){
                    var count = $elm.find('.owl-item').length,
                        activeIndex = $elm.find('.owl-item').filter('.active').index() + 1;

                    var html = '<div class="ui-counter"><span class="current">' + activeIndex + '</span>/<span class="total">' + count + '</span></div>';

                    $elm.append(html);
                },
                afterMove : function($elm){
                    var activeIndex = $elm.find('.owl-item').filter('.active').index() + 1;


                    $('.ui-counter').find('.current').html(activeIndex);
                }
            });
        }

        // Form Validation
        if(($validate = $('.validate-form')).length){
            var length = $validate.length;
            for(var i= 0; i < length; i++){
                $validate.eq(i).validate({
                    //only show the first error
                    showErrors: function(errorMap, errorList) {
                        if (errorList.length) {
                            var s = errorList.shift();
                            var n = [];
                            n.push(s);
                            this.errorList = n;
                        }
                        this.defaultShowErrors();
                    }
                });
            }
        }

        //Mobile Breakpoints
        Respond.to([
            {
                'media': '(max-width: 768px)',
                'namespace': '768_Tablet',
                'if': function () {
                    $('body').addClass('mobile');

                    //Navigation
                    if (($navigation = $('#masthead')).length) {
                        //Mobile Navigation
                        $navigation.Tray();
                    }

                    if(($fixed = $('#content')).length && $fixed.data('Fixed')){
                        $fixed.Fixed('unset');
                    }

                    if(($mobileAccordion = $('.gor-mobile-accordion')).length){
                        $mobileAccordion.Accordion();
                    }
                },
                'else': function(){
                    $('body').removeClass('mobile');

                    //Navigation
                    if(($navigation = $('#masthead')).length){
                        //Mobile Navigation
                        $navigation.Tray('unset');
                    }

                    if(($mobileAccordion = $('.gor-mobile-accordion')).length){
                        $mobileAccordion.Accordion('unset');
                    }
                }
            }
        ]);

    });

})(window.jQuery);