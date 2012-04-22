/* mAze - jQuery Plugin for Button Rollovers
	Canvas code based off of this tutorial-
	http://www.ajaxblender.com/howto-convert-image-to-grayscale-using-javascript.html
*/	


;(function( $, window, document, undefined ){

	console = (console) ? console : { log: function() {} }

  // the plugin prototype
  var mAze = {
    defaults: {

    },
		options : null,
    init: function(options, elem) {
			var self = this;
			$('*[data-effect]').each(function() {
				self.setupSourceImage(this);
			});
      return this;
    },
		setupSourceImage : function(elem) {
			self = this;
			$this = $(elem);
			if(!$this.is('a')) {
				console.log('mAze must be applied to an anchor tag');
				return;
			}			
			var $srcImg = $('img',elem).first();
			var hasImage = ($srcImg.length >= 1) ? true : false;
			
			if(!hasImage) {
				console.log('no image');
				var bgSrc = self.getBG( $this.css('backgroundImage') );
				if(!bgSrc) {
					console.log('.mAze element is missing an image source.');
					return false;
				}
				else {						
					var bgPos = $this.css('backgroundPosition');
					var width = $this.width();
					var height = $this.height();
					var offsetX = self.getPosition(bgPos, 0);
					var offsetY = self.getPosition(bgPos, 1);
					console.log(width, height, offsetX, offsetY);
					if(!width || !height) {
						console.log('mAze element has a background image but is missing a dimension(width or height)');
						return false;
					}
					self.createImage(elem, bgSrc, width, height, offsetX, offsetY);
				}
			} else {
				this.transformImage($srcImg);
			}
		},
		transformImage : function(imgObj) {
			$imgObj = $(imgObj);
			var canvas = document.createElement('canvas');
			var canvasContext = canvas.getContext('2d');
			var imgW = $imgObj.width();
			var imgH = $imgObj.height();
			canvas.width = imgW;
			canvas.height = imgH;
			console.log('transforming image', imgObj);
			canvasContext.drawImage($imgObj.get(0), 0, 0);

			var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

			for(var y = 0; y < imgPixels.height; y++){
			     for(var x = 0; x < imgPixels.width; x++){
			          var i = (y * 4) * imgPixels.width + x * 4;
			          var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
			          imgPixels.data[i] = avg;
			          imgPixels.data[i + 1] = avg;
			          imgPixels.data[i + 2] = avg;
			     }			
			}
			canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);

			return canvas.toDataURL();
		},
		createImage : function(container, imgUrl, width, height, offsetX, offsetY) {
			var self = this;
			var imgObj = new Image();
			imgObj.src = imgUrl;
			$(imgObj).load(function() {
				self.generateNewImage(container, this, width, height, offsetX, offsetY);
			});
		},
		generateNewImage : function(container, imgObj, width, height, offsetX, offsetY) {
			console.log('generating new image ', imgObj, width, height);
			var canvas = document.createElement('canvas');
			var canvasContext = canvas.getContext('2d');
			var imgW = width;
			var imgH = height;
			canvas.width = imgW;
			canvas.height = imgH;
			canvasContext.drawImage(imgObj, 0, 0);

			var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
			console.log('imgPixels', imgPixels, imgW, imgH);
			for(var y = 0; y < imgPixels.height; y++){
			     for(var x = 0; x < imgPixels.width; x++){
			          var i = (y * 4) * imgPixels.width + x * 4;
			          var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
			          imgPixels.data[i] = avg;
			          imgPixels.data[i + 1] = avg;
			          imgPixels.data[i + 2] = avg;
			     }
			}
			canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			console.log('creating new image ', container, imgObj, width, height, offsetX, offsetY, canvas.toDataURL());
			$(container).html('');
			$newImg = $('<img>').attr('src', canvas.toDataURL()).width(width).height(height).appendTo(container).addClass('createdImg');
			this.transformImage($newImg);
		},
		getBG : function(str) {
			if(!str) return false;
			return str.replace(/url|[\(\)]/g,'');
		},
		getPosition : function(str, idx) {
			console.log(str, idx);
			var rawArr = str.split(' ');
			if(typeof rawArr[idx] == undefined) return false;
			return this.retainNumbers(rawArr[idx]);
		},
		retainNumbers : function(str) {
			return str.replace(/[^\d]/g, '');
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
	
	$('body').mAze();

})( jQuery, window , document );