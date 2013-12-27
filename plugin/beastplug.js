// Filename: beastplug.js  
// Timestamp: 2013.12.26-21:24:57 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: elemst.js, beast.js

var beast = require('../beast.js');

var beastplug = ((typeof module === 'object') ? module : {}).exports = function (name, augmfn) {
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

  beast.proto[name] = function (opts) {
    var that = Object.create(pluginproto);
    
    augmfn(that);
    that.opts = opts;
    that.className = that.className.replace(/:name/, name);
    if (typeof opts.isclean === 'boolean') {
      that.isclean = opts.isclean;
    }
    this.ngnArr.push(that);

    return this;
  };
};
