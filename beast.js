// Filename: beast.js  
// Timestamp: 2013.12.24-16:37:55 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: eventhook.js

var eventhook = require('eventhook');

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

