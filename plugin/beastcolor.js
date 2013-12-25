// Filename: beastcolor.js  
// Timestamp: 2013.12.24-00:30:02 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: elemst.js, curved.js, beastplug.js
//
//
// ex,
//
// beast({ frames : 30 }).color({ 
//   elem : elem, 
//   ease : 'out' 
//   bgnColor : '#aaf',
//   endColor : '#aaf',
//   endBackgroundColor : 'rgb("255", "255", "255")'
// }).init();


beastplug(function color (b) {

  b.extractRGBarr = function (rgbStr) {
    if (rgbStr.match(/^#/)) {
      return rgbStr
        .replace(/^#(\w\w\w)$/, '$1$1')
        .match(/(\w\w)(\w\w)(\w\w)/)
        .slice(1, 4)
        .map(function (n) { return parseInt(n, 16); });
    } else if (rgbStr.match(/^rgba?/)) {
      return rgbStr
        .match(/^rgba?\((\d{1,3}), (\d{1,3}), (\d{1,3}),? ?(\d{1,3})?\)$/)
        .slice(1, 4)
        .map(function (n) { return parseInt(n, 10); });
    }
  };

  b.buildRGBarray = function (frames, opts, bgnRGB, endRGB) {
    var rgbarr = [],
        ease = opts.ease,
        bgnRGBarr = b.extractRGBarr(bgnRGB),
        endRGBarr = b.extractRGBarr(endRGB),
        rcurve = curved(bgnRGBarr[0], endRGBarr[0], ease),
        gcurve = curved(bgnRGBarr[1], endRGBarr[1], ease),
        bcurve = curved(bgnRGBarr[2], endRGBarr[2], ease);

    b.doframeloop(frames, function (per, frame) {
      rgbarr.push([
        rcurve(per), gcurve(per), bcurve(per)
      ]);
    });

    return rgbarr;
  };

  b.clean = function (frames, opts) {
    var style = opts.elem.style;
    style.backgroundColor = '';
    style.color = '';
  };

  b.getdata = function (frames, opts) {
    var elem = opts.elem,
        bgarr = [],
        fgarr = [],
        endfgrgb = opts.endColor || 
                     b.getComputed(elem, 'color'),
        endbgrgb = opts.endBackgroundColor || 
                     b.getComputed(elem, 'background-color'),
        bgnfgrgb = opts.bgnColor ||
                     b.getComputed(elem, 'color'),
        bgnbgrgb = opts.bgnBackgroundColor ||
                     b.getComputed(elem, 'background-color');


    opts.fgarr = b.buildRGBarray(frames, opts, bgnfgrgb, endfgrgb);
    opts.bgarr = b.buildRGBarray(frames, opts, bgnbgrgb, endbgrgb);
  };

  b.getupdatefn = function (frames, opts) {
    var bgarr = opts.bgarr,
        fgarr = opts.fgarr,
        style = opts.elem.style,
        rgbStr = "rgb(:r, :g, :b)",
        bg, fg;
    
    return function (frame) {
      bg = bgarr[frame];
      fg = fgarr[frame];

      style.backgroundColor = 
        rgbStr.replace(/:r/, bg[0]).replace(/:g/, bg[1]).replace(/:b/, bg[2]);
      style.color = 
        rgbStr.replace(/:r/, fg[0]).replace(/:g/, fg[1]).replace(/:b/, fg[2]);
    };
  };
});
