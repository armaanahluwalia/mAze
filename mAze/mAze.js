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
        timing : 200,
				ie : {
					'filter' : 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)'
				}
      }
    },
		_isIE : null,
    _options : null,
    init: function(options, elem) {
			var self = this;
			
			this._options = $.extend({}, this.defaults, options);
			this._isIE = (this.isIE() == -1) ? false : true;	
			$('*[data-btn]').each(function() {
				
				var $btn = $(this).addClass('mAze_btn');
			  var effectName = $btn.attr('data-btn');
			
				if(!self._isIE) {
				//If its not IE
					var dfd = self.setupImages(this, effectName);
					(function(btn, effectName) {
	  				dfd.done(function() {
	  				  self.setupHover(btn, effectName);
	  				});				  
					})($btn, effectName);
					
				}	else {
				//If it is IE
					self.setupIE($btn, effectName);
				}
				
			});
      return this;
    },
		setupIE : function($btn, effectName) {
			var effects = this._options[effectName]['ie'];
			var self= this;
			if(effects) {
				var theClass = (self._options[effectName]['reverse']) ? 'mAze_u' : 'mAze_o';
				var theOtherClass = (self._options[effectName]['reverse']) ? 'mAze_o' : 'mAze_u';
				$underBtn = $('img',$btn).first().addClass(theClass);
				
				$underBtn.imagesLoaded(function() {
  				$btn.css({ 'width' : $underBtn.width(), 'height' : $underBtn.height(), 'display': 'inline-block' })				

  				$overBtn = $underBtn.clone().removeClass(theClass).addClass(theOtherClass).appendTo($btn);
  				for (var i in effects) {
  					$('.mAze_o', $btn).css(i, effects[i]);
  				}				
  	      $btn.hover(
  	        function() {
  	          $('.' + theClass, this).animate({opacity:0}, self._options[effectName]['timing']);
  	        },
  	        function() {
  	          $('.' + theClass, this).animate({opacity:1}, self._options[effectName]['timing']);
  	        }
  				);				  
				});
			}
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
			var self = this;
			var $this = $(container);
			
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
			
			$($srcImg).imagesLoaded(function() {
  			$this.css({ 'width' : $srcImg.width(), 'height' : $srcImg.height(), 'display': 'inline-block' })

  			var under_dfd = self.setupUnderImg( container, $srcImg, effectName );
  			var over_dfd = self.setupOverImg( container, $srcImg , effectName );
  			(function(dfd) {
    			$.when(under_dfd, over_dfd).
    				done(function() {
    				  dfd.resolve();
    				});			  
  			})(dfd);			  
			});
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
		},
		isIE : function() {
		  var rv = -1; // Return value assumes failure.
		  if (navigator.appName == 'Microsoft Internet Explorer')
		  {
		    var ua = navigator.userAgent;
		    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		    if (re.exec(ua) != null)
		      rv = parseFloat( RegExp.$1 );
		  }
		  return rv;
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