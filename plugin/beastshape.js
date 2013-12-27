// Filename: beastshape.js  
// Timestamp: 2013.12.26-21:24:02 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: curved.js, elemst.js, domwh.js, beastplug.js
//
//
// adds 'plugin' ability to the animation system here.
//

beastplug('shape', function (b) {

  b.getdata = function (frames, opts) {
    var elem = opts.elem,
        ease = opts.ease,
        whcur = domwh(elem),
        whbgn = opts.whbgn || whcur,
        whend = opts.whend || whcur,
        wharr = [],
        isw = b.isanimated(whbgn, whend, 0),
        ish = b.isanimated(whbgn, whend, 1),
        wcurve = isw && curved(whbgn[0], whend[0], ease),
        hcurve = ish && curved(whbgn[1], whend[1], ease);

    b.doframeloop(frames, function (per, frame) {
      wharr.push([
        wcurve && wcurve(per),
        hcurve && hcurve(per)
      ]);    
    });

    b.isw = isw;
    b.ish = ish;
    b.wharr = wharr;
    return wharr;
  };

  b.clean = function (frames, opts) {
    var style = opts.elem.style;
    style.width = '';
    style.height = '';
  };

  b.getupdatefn = function (frames, opts) {
    var stylestr = ':0px',
        wharr = b.wharr,
        style = opts.elem.style,
        isw = b.isw,
        ish = b.ish,
        wh;

    return function (frame) {
      wh = wharr[frame];
      if (isw) style.width = stylestr.replace(/:0/, wh[0]);
      if (ish) style.height = stylestr.replace(/:0/, wh[1]);
    };
  };
});

