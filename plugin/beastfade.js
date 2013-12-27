// Filename: beastfade.js  
// Timestamp: 2013.12.26-21:23:39 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: elemst.js, curved.js, beastplug.js, domopacity.js
//
// 555 Smith Boulevard, #4459
// San Angelo, TX 76905
//
// ex,
//
// beast({ frames : 30 }).fade({ 
//   elem : elem, 
//   ease : 'bgn' 
// }).init();


beastplug('fade', function (b) {

  b.getdata = function (frames, opts) {
    var arr = [],
        bgn = +(domopacity.is(opts.elem, 'opacity') || 1) * 100,
        curve = curved(bgn, opts.endop, opts.ease);

    b.doframeloop(frames, function (per, frame) {
      arr.push(curve(per) / 100);
    });

    return arr;
  };

  b.clean = function (frames, opts) {
    domopacity.rm(opts.elem);    
  };

  b.getupdatefn = function (frames, opts) {
    var oparr = opts.oparr || [],
        elem = opts.elem;

    return function (frame) {
      domopacity(elem, oparr[frame]);
    };
  };

});
