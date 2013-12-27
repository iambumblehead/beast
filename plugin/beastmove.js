// Filename: beastmove.js  
// Timestamp: 2013.12.26-21:23:51 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: curved.js, elemst.js, beastplug.js, domlt.js
//
//
// ex,
//
// beast({ frames : 30 }).move({ 
//   elem : elem, 
//   ltbgn : [0, 0],
//   ltend : [200, 200]
// }).init();
//
// element should be styled 'absolute' and 'block'

beastplug('move', function (b) {

  b.getdata = function (frames, opts) {
    var elem = opts.elem,
        ease = opts.ease,
        ltcur = domlt(elem),
        ltbgn = opts.ltbgn || ltcur,
        ltend = opts.ltend || ltcur,
        ltarr = [],
        isl = b.isanimated(ltbgn, ltend, 0),
        ist = b.isanimated(ltbgn, ltend, 1),
        xcurve = isl && curved(ltbgn[0], ltend[0], ease),
        ycurve = ist && curved(ltbgn[1], ltend[1], ease);

    b.doframeloop(frames, function (per, frame) {
      ltarr.push([
        xcurve && xcurve(per),
        ycurve && ycurve(per)
      ]);    
    });

    b.isl = isl;
    b.ist = ist;
    b.ltarr = ltarr;
    return ltarr;
  };

  b.clean = function (frames, opts) {
    var style = opts.elem.style;
    style.top = '';
    style.left = '';
  };

  b.getupdatefn = function (frames, opts) {
    var stylestr = ':0px',
        ltarr = b.ltarr,
        style = opts.elem.style,
        isl = b.isl,
        ist = b.ist,
        lt;

    return function (frame) {
      lt = ltarr[frame];
      if (isl) style.left = stylestr.replace(/:0/, lt[0]);
      if (ist) style.top = stylestr.replace(/:0/, lt[1]);
    };
  };
});
