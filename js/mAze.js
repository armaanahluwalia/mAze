/* mAze - jQuery Plugin for Button Rollovers
   Author - Armaan Ahluwalia
   Dependencies : Pixastic - http://www.pixastic.com/
*/	


;(function( $, window, document, undefined ){

	console = (console) ? console : { log: function() {} }

  // the plugin prototype
  var mAze = {
    defaults: {
      'gray' : {
        effect : 'desaturate',
        options : null,
        timing : 200
      }
    },
    _options : null,
    init: function(options, elem) {
			var self = this;
			
			this._options = $.extend({}, this.defaults, options);
			
			$('*[data-btn]').each(function() {
				var $btn = $(this).addClass('mAze_btn');
			  var effectName = $btn.attr('data-btn');			  
				var dfd = self.setupImages(this, effectName);
				(function(btn, effectName) {
  				dfd.done(function() {
  				  self.setupHover(btn, effectName);
  				});				  
				})($btn, effectName);
			});
      return this;
    },
    setupHover : function(container, effect) {
      var self = this;
      $(container).hover(
        function() {
          $('.mAze_o', this).animate({opacity:0}, self._options[effect]['timing']);
        },
        function() {
          $('.mAze_o', this).animate({opacity:1}, self._options[effect]['timing']);
        }
      )
    },
		setupImages : function(container, effectName) {
		  var dfd = $.Deferred();
			self = this;
			$this = $(container);
			
			//Check if it is an anchor element
			if(!$this.is('a')) {
				console.log('mAze must be applied to an anchor tag');
				return;
			}
			
			var $srcImg = $('img',container).first();
			var hasImage = ($srcImg.length >= 1) ? true : false;
			
			//If there is no image inside the tag
			if(!hasImage) {
				throw('.mAze element is missing an image source.');
				return false;
			}
			$this.css({ 'width' : $srcImg.width(), 'height' : $srcImg.height(), 'display': 'block' })

			var under_dfd = self.setupUnderImg( container, $srcImg, effectName );
			var over_dfd = self.setupOverImg( container, $srcImg , effectName );
			(function(dfd) {
  			$.when(under_dfd, over_dfd).
  				done(function() {
  				  dfd.resolve();
  				});			  
			})(dfd);
			return dfd;
		},
		setupUnderImg : function(container, input, effect ) {
	    var dfd = $.Deferred();
	    var theClass = (this._options[effect]['reverse']) ? 'mAze_o' : 'mAze_u';
	    $(input).addClass(theClass);
	    dfd.resolve();
	    return dfd;
		},
		setupOverImg : function(container, input, effect ) {
	    var dfd = $.Deferred();
      this.transformImage(dfd, container, input, effect);
	    return dfd;
		},		
		transformImage : function(dfd, container, img, effect) {
			var self = this;
			$container = $(container);
		  var effectData = this._options[effect];
		  if(!effectData) console.log('some mAze effect is undefined');
	    var theClass = (effectData['reverse']) ? 'mAze_u' : 'mAze_o';
	    var theRemoveClass = (effectData['reverse']) ? 'mAze_o' : 'mAze_u';
		  $newImg = $(img).clone().removeClass(theRemoveClass).appendTo($container);
      $newImg.pixastic(effectData['effect'], effectData['options']).addClass(theClass);
		  dfd.resolve();
		}
  }

	$.plugin = function( name, object ) {
	  $.fn[name] = function( options ) {
	    return this.each(function() {
	      if ( ! $.data( this, name ) ) {
	        $.data( this, name, Object.create(object).init(
	        options, this ) );
	      }		
	    });
	  };
	};

	$.plugin('mAze', mAze);

})( jQuery, window , document );