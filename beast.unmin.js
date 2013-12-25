// Filename: beast.full.js  
// Timestamp: 2013/12/24 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com), Dan Pupius (www.pupius.co.uk)  

// Filename: domlt.js  
// Timestamp: 2013.12.24-17:13:49 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
//
// documentElement.getBoundingClientRect() is mature and widely supported:
// https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect

var domlt = function (el) {
  var rect = el.getBoundingClientRect();
  return [rect.left, rect.top];
};
// Filename: incrnum.js  
// Timestamp: 2013.10.22-11:32:49 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

var incrnum = ((typeof module === 'object') ? module : {}).exports = (function (uid, fn) {
  
  fn = function () { return uid++; };
  fn.toString = function () { return uid++; };

  return fn;

}(0));
// Filename: eventhook.js
// Timestamp: 2013.10.30-10:51:34 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: incrnum.js



var eventhook = ((typeof module === 'object') ? module : {}).exports = (function () {

  var proto = {
    fnArr: [],

    addFn: function (fn) {
      if (typeof fn === 'function') {
        fn.oname = 'fn' + incrnum;
        this.fnArr.push(fn);
      }
    },

    rmFn: function (fn) {
      var oname = fn.oname;

      if (typeof fn === 'function') {
        this.fnArr = this.fnArr.filter(function (fn) {
          return fn.oname !== oname;
        });
      }
    },

    fire: function (a1,a2,a3,a4) {
      this.fnArr.map(function (fn) {
        fn(a1,a2,a3,a4);
      });
    }
  };

  return {
    proto : proto,
    getNew : function () {
      var that = Object.create(proto);
      that.fnArr = [];
      return that;
    }
  };

}());
// Filename: beast.js  
// Timestamp: 2013.12.24-16:37:55 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: eventhook.js



var beast = ((typeof module === 'object') ? module : {}).exports = (function (p) {

  var proto = {
    frames : 30,
    fpms : (30 / 1000),
    mspf : 0.03,
    timer : null,
    frameindex : 0,
    ngnArr : [],
    isKilled : false,
    isComplete : false,
    // st: 1 continue, 2 sleep, 3 reset, 4 kill
    st : 1, 

    onComplete : function (fn) {
      this.onCompleteHook.addFn(fn);
      return this;
    },

    onKill : function (fn) {
      this.onKillHook.addFn(fn);
      return this;
    },

    onBegin : function (fn) {
      this.onBeginHook.addFn(fn);
      return this;
    },

    updateNgnItems : function (frame) {
      this.ngnArr.map(function (ngn) {
        ngn.updatefn(frame);
      });    
    },

    initNgnItems : function (frames, opts) {
      frames = this.frames;
      this.ngnArr.map(function (ngn) {
        ngn.init(frames, ngn.opts);
        ngn.updatefn = ngn.getupdatefn(frames, ngn.opts);
      });
    },

    killNgnItems : function (frames, opts) {
      frames = this.frames;
      this.ngnArr.map(function (ngn) {
        ngn.kill(frames, ngn.opts);
      });
    },

    completeNgns : function (frames, opts) {
      frames = this.frames;
      this.ngnArr.map(function (ngn) {
        ngn.complete(frames, ngn.opts);
      });
    },

    applyFnComplete : function () {
      if (this.st === 1 || this.st === 4) {
        this.onCompleteHook.fire();
      }
    },

    applyFnKill : function () {
      this.onKillHook.fire();
    },

    applyFnBegin : function () {
      this.onBeginHook.fire();
    },

    updateNgns : function () {
      var that = this;

      that.updateNgnItems(that.frameindex);
      ++that.frameindex;
    },

    updateAnimationState : function () {
      var that = this;

      if (that.isKilled) {
        that.st = 3;
      } else if (that.frameindex >= that.frames) {
        that.st = 4;
      }
    },

    animate : function () {
      var my = this;
      (function nextFrame() {
        my.updateAnimationState();
        switch (my.st) {
        case 1: // continue
          my.updateNgns();
          my.timer = setTimeout(nextFrame, my.mspf);
          break;
        case 2: // sleep
          my.st = 1;
          break;
        case 3: // killed
          my.st = 3;
          my.kill();
          break;
        default: // completed
          my.st = 4;
          my.complete();
          break;
        }
      }());
    },

    complete : function () {
      var that = this;

      if (!that.isKilled && !that.isComplete) {
        that.isComplete = true;
        // ... for external call to kill loop
        that.st = 4;
        that.completeNgns();
        that.applyFnComplete();
      }
    },

    kill : function () {
      var that = this;
      
      if (!that.isKilled && !that.isComplete) {
        that.isKilled = true;
        that.st = 3;
        that.killNgnItems();
        that.applyFnKill();
      }
    },

    init : function (fn) {
      var that = this;

      if (typeof fn === 'function') {
        that.onComplete(fn);
      }

      if (that.st === 4) {
        that.st = 1;
        that.applyFnBegin();
        that.isKilled = false;
        that.isComplete = false;
        that.frameindex = 0;
        that.initNgnItems();
        that.animate();
      }
    },

    reinit : function () {
      var that = this;

      that.kill();
      that.st = 4;
      that.init();
    }
  };

  p = function (spec) {
    var that;

    that = Object.create(proto);
    that.timer = null;

    that.onCompleteHook = eventhook.getNew();
    that.onKillHook = eventhook.getNew();
    that.onBeginHook = eventhook.getNew();
    that.ngnArr = [];
    that.isKilled = false;
    that.isComplete = false;
    that.frameindex = 0;
    that.st = 4;

    that.frames = spec.frames || 30;
    that.fpms = (spec.fps || 30) / 1000;
    that.mspf = 1 / that.fpms; 
    return that;
  };

  p.proto = proto;

  return p;

}());

// Filename: elemst.js  
// Timestamp: 2013.12.16-00:25:06 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
//
// methods for handling "state" of an element through className:
//
// elemstate.up()
// elemstate.is()
// elemstate.rm()

var elemst = {

  // elemstate.up(elem, 'select-active');
  // - ensures `st-select-active` is defined on elem.className
  // - if `st-select-active` is defined on elem.className, elem is not modified
  // - if `st-select-\w*` is defined on elem.className, it is replaced.
  // 
  // all states are prefixed with `st-`
  // ex, 
  //  elemstate.up(elem, 'select-active'); // st-select-active
  //  elemstate.up(elem, 'active'); // st-active
  //
  // why? easier to identify and replace classNames associated with this script
  //
  // if a hyphen is given the word behind the first hyphen
  // is recognized as an *id*. word(s) after hyphen are the
  // *state*. if no hyphen, value is assumed to be *state*.
  //
  // Use of *id* allows one to store multiple states on a className, associating 
  // each with a different *id*, for example:
  //  `st-isselected-true st-isopen-true st-iscomplete-false`
  //
  // *id* is not required -this OK:
  //  `st-active`
  //
  up : function (elem, stateidStr) {
    var className, 
        newclass = 'st-' + stateidStr,
        stateid = (stateidStr || '').match(/(\w*(?:-)|\b)(\w*)/) || [],
        state = stateid[2],
        id = stateid[1] || '';

    if (elem && state) {
      className = elem.className;
      if (!className.match(newclass)) {
        stateid = new RegExp('st-' + '\(' + id + '\\w*\)');
        if (className.match(stateid)) {
          elem.className = className.replace(stateid, newclass);
        } else {
          elem.className = className + ' ' + newclass;
        }
      }
    }
  },

  // elemstate.rm(elem, 'select');
  // - removes entire word class with substring at index 0 matching stateidstr
  //
  // console.log(elem.className); // bttn st-select-active st-active
  // elemstate.rm(elem, 'select');
  // console.log(elem.className); // bttn st-active
  // elemstate.rm(elem, 'active');
  // console.log(elem.className); // bttn
  //
  rm : function (elem, stateidStr) {
    var className, 
        stateid = new RegExp('[\b ]st-' + stateidStr + '\(-\\w*\)?');

    if (elem) {
      className = elem.className;
      if (className.match(stateid)) {
        elem.className = className.replace(stateid, '');
      }
    }
  },

  is : function (elem, stateidStr) {
    return (elem && elem.className.match('st-' + stateidStr)) ? true : false;
  }
};
// Filename: beastplug.js  
// Timestamp: 2013.12.24-17:42:13 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: elemst.js, beast.js



var beastplug = ((typeof module === 'object') ? module : {}).exports = function (augmfn) {
  // redefine these values with plugin
  var pluginproto = {
    className : ':name-beast-animating',
    isclean : true,

    // convenience methods for use by plugins
    doframeloop : function (frames, fn) {
      for (var i = 0, step = frames - 1; i < frames; i++) fn(i/step, i);
    },
    getComputed : function (elem, style) {
      return getComputedStyle(elem, null).getPropertyValue(style);
    },
    isanimated : function (arr1, arr2, i) {
      return arr1[i] !== arr2[i];
    },

    // methods called at begin of animation for setup
    getdata : function (frames, opts) {},

    getupdatefn : function (frames, opts) {
      return function () {};
    },

    // methods called during the animation cycle
    init : function (frames, opts) {
      elemst.up(opts.elem, this.className);
      opts.oparr = this.getdata(frames, opts);
    },

    clean : function (frames, opts) {},

    kill : function (frames, opts) {
      elemst.rm(opts.elem, this.className);
      if (this.isclean) this.clean(frames, opts);
    },

    complete : function (frames, opts) {
      if (opts.classNameEnd) {
        elemst.up(opts.elem, opts.classNameEnd);
      }
      elemst.rm(opts.elem, this.className);
      if (this.isclean) this.clean(frames, opts);
    }
  };

  beast.proto[augmfn.name] = function (opts) {
    var that = Object.create(pluginproto);
    
    augmfn(that);
    that.opts = opts;
    that.className = that.className.replace(/:name/, augmfn.name);
    if (typeof opts.isclean === 'boolean') {
      that.isclean = opts.isclean;
    }
    this.ngnArr.push(that);

    return this;
  };
};
// Filename: curved.js
// Timestamp: 2013.12.22-22:08:26 (last modified)  
// Author(s): Dan Pupius (www.pupius.co.uk), Bumblehead (www.bumblehead.com)
//
// thanks to Daniel Pupius
// http://13thparallel.com/archive/bezier-curves/
//
// Bernstein Basis Function
// 1 = t + (1 - t)
//
// Bernstein Basis Function, cubed
// 1^3 = (t + (1 - t))^3
//
// Above Function, represented in terms of 1.
// » 1 = (t + (1 - t)) . (t^2 + 2t(1 - t) + (1 - t)^2)
// » 1 = t^3 + 3t^2(1 - t) + 3t(1 - t)^2 + (1 - t)^3
//
// each function
// B[1](t) = t^3
// B[2](t) = 3t^2(1 - t)
// B[3](t) = 3t(1 - t)^2
// B[4](t) = (1 - t)^3
//
// Where C is the control, and '[ ]' indicates subscript
// point = C[1]B[1](d) + C[2]B[2](d) + C[3]B[3](d) + C[4]B[4](d)
//
// Some changes to the scripting given at the link above:
// - given values are 'shifted' into a positive axis so that curves may be
//   generated when negative values are given.
// - xy values are stored in an array rather than an object

var curved = ((typeof module === 'object') ? module : {}).exports = (function () {

  function B1(t) { return t * t * t; }
  function B2(t) { return 3 * t * t * (1 - t); }
  function B3(t) { return 3 * t * (1 - t) * (1 - t); }
  function B4(t) { return (1 - t) * (1 - t) * (1 - t); }

  function getShift(x1, x2) {
    var min = Math.min(x1, x2);
    return min && -min;
  }

  // easeStr should be a string 'ease-end' or 'ease-bgn'
  return function (bgnCoord, endCoord, easeStr) {
    var shiftval = getShift(bgnCoord, endCoord),
        C1 = endCoord + shiftval,
        C4 = bgnCoord + shiftval,
        C2_3 = easeStr === 'ease-end' ? C1 : C4;

    return function (per) {
      return Math.round(
        C1 * B1(per) +
        C2_3 * B2(per) +
        C2_3 * B3(per) +
        C4 * B4(per)
      ) - shiftval;
    };
  };

}());
// Filename: beastmove.js  
// Timestamp: 2013.12.24-17:51:02 (last modified)  
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

beastplug(function move (b) {

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
// Filename: domopacity.js  
// Timestamp: 2013.12.22-20:53:15 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
//
// if undefined, getComputedStyle should be defined by polyfill.
//
// the 'is' method for the IE branch is from Garret Smith's APE library:
//   - http://www.highdots.com/forums/javascript/get-opacity-value-291932.html
//   - https://github.com/GarrettS/ape-javascript-library

var domopacity = (function (s, p, deffn) {
  
  s = document.documentElement.style;
  deffn = function () {};

  if ('opacity' in s) {
    p = function (elem, percent) {
      elem.style.opacity = percent;
    };
    p.rm = function (elem) {
      elem.style.opacity = '';
    };
    p.is = function (elem) {
      return getComputedStyle(elem, null).getPropertyValue('opacity');
    };
  } else if ('filter' in s) {
    p = function (elem, percent) {
      elem.style.filter = 'alpha(opacity=:o)'.replace(/:o/, percent * 100);
    };
    p.rm = function (elem) {
      elem.style.filter = '';
    };
    p.is = function (elem) {
      var re = /\Wopacity\s*=\s*([\d]+)/i,
          cs = elem.currentStyle, f, o;

      if (typeof cs === 'object') {
        f = cs.filter;
        if (!re.test(f)) {
          return 1;
        } else {
          o = re.exec(f);
          return o[1]/100;      
        }
      };
    };
  } else {
    p = p.rm = p.is = deffn;
  }
  
  return p;

}());
// Filename: beastfade.js  
// Timestamp: 2013.12.23-23:50:48 (last modified)  
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


beastplug(function fade (b) {

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
// Filename: domwh.js  
// Timestamp: 2013.12.18-20:33:32 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

var domwh = (function (p, d, doc) {

  doc = document;

  p = function(elem) {
    var dims = [], d;

    if (elem.offsetWidth) {
      dims = [elem.offsetWidth, elem.offsetHeight];
    } else {
      d = elem.style;      
      if (d.display === 'none') {
        d.display = 'block';
        dims = [elem.offsetWidth, elem.offsetHeight];
        d.display = 'none';
      } else if (d.display === '') {
        d.display = 'block';
        dims = [elem.offsetWidth, elem.offsetHeight];
        d.display = '';
      }
    }
    return dims;
  };

  p.window = function () {
    if (window && window.innerHeight) {
      return [window.innerWidth, window.innerHeight];
    } else if ((d = doc.documentElement)) {
      d = d.clientWidth ? d : doc.documentBody;
      return [d.clientWidth, d.clientHeight];
    } else {
      return null;
    }
  };

  return p;

}());
// Filename: beastshape.js  
// Timestamp: 2013.12.24-17:52:05 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: curved.js, elemst.js, domwh.js, beastplug.js
//
//
// adds 'plugin' ability to the animation system here.
//

beastplug(function shape (b) {

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

// Filename: beast.full.js  
// Timestamp: 2013.12.24-15:56:25 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: beast.js, beastshape.js, beastfade.js, beastcolor.js, beastmove.js
//
// placeholder file for directing scroungejs build
