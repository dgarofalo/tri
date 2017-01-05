/*!
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

	$.fn.unveil = function(threshold, callback) {

		var $w     = $(window),
			th     = threshold || 100,
			mql    = window.matchMedia("(max-width: 768px)"),
            mobile = mql.matches,
            attrib = mobile ? "data-src-mobile" : "data-src",
            bg     = mobile ? "data-bg-mobile" : "data-bg",
            images = this,
			loaded;

        this.one("unveil", function() {
            var self = this;
            var bg_source  = this.getAttribute(bg) ? this.getAttribute(bg) : this.getAttribute("data-bg");
            var source     = bg_source ? bg_source : this.getAttribute(attrib);
            source         = source || this.getAttribute("data-src") || this.getAttribute("data-bg");

            if (source) {
                //ensure image loads before setting the source
                var img = new Image();
                img.setAttribute("src", source);
                $(img).on('load', function(){
                    if (bg_source) {
                        self.style.backgroundImage = "url('" + source + "')";
                    } else {
                        self.setAttribute("src", source);
                    }
                    if (typeof callback === "function") callback.call(self);
                });
            }else{
                if (typeof callback === "function") callback.call(self);
            }
        });

		function unveil() {
			var inview = images.filter(function() {
				var $e = $(this);
				if ($e.is(":hidden")) return;

				var wt = $w.scrollTop(),
					wb = wt + $w.height(),
					et = $e.offset().top,
					eb = et + $e.height();

				return eb >= wt - th && et <= wb + th;
			});

			loaded = inview.trigger("unveil");
			images = images.not(loaded);
		}

		$w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

		unveil();

		return this;

	};

})(window.jQuery || window.Zepto);
