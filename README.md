# mAze - jQuery Buttonizer #

## Overview ##

This jQuery plugin lets you easily create animation effects on image buttons so you never have to create another rollover sprite again.

### Usage ###

The easiest way to use mAze is to simply add the *data-btn* attribute to your anchor buttons that have images in them. This allows you can choose from the premade mAze effects.
```
<script type="text/javascript>
  $('body').mAze();
</script>

<a data-btn="gray"><img src="my-button.png" /></a>
```

You can also choose to create your own effect for an mAze button. mAze relies on Pixastic to do the heavy pixel lifting. Refer to the Pixastic docs at http://www.pixastic.com/lib/docs/ to see what effects you can choose from.

**Note**: Using the "reverse" option applies the effect on rollover instead of the other way around.

```
$('body').mAze({
  'blur' : {
    effect : 'glow',
    options : { amount:0.5, radius:1.0 },
    timing : 100,
    reverse : true
  }
});		
```