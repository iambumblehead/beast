// Filename: beast-test-boxlet.js
// Timestamp: 2014.05.11-16:37:07 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: lsn.js, domev.js, elemst.js, lockfn.js
// beastshape.js, beastfade.js, beastcolor.js, beastmove.js
//
// show boxlet-contet-prev or boxlet-content-full
// hide one boxlet-content when the other is shown.
//
// +-----------------------------+
// |  boxlet                     |
// |   +---------------------+   |
// |   | boxlet-title        |   | 
// |   +---------------------+   |
// |   +---------------------+   |
// |   | boxlet-content-prev |   | 
// |   |                     |   | 
// |   |                     |   | 
// |   +---------------------+   |
// |   +---------------------+   |
// |   | boxlet-content-full |   | 
// |   |                     |   | 
// |   |                     |   | 
// |   |                     |   | 
// |   +---------------------+   |
// |                             |
// +-----------------------------+
//
// +-----------------------------+
// |  boxlet                  +  |
// |                             |
// |     preview content         |
// |     foo bar baz             |
// |                             |
// +-----------------------------+
//
// +-----------------------------+
// |^ boxlet ^^^^^^^^^^^^^^^^ - ^|
// |^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|
// |^^^^ full content ^^^^^^^^^^^|
// |^^^^ foo bar baz ^^^^^^^^^^^^|
// |^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|
// +-----------------------------+


var boxlet = (function () {

  var proto = {
    boxId : '',
    boxTitleId : '',
    boxContentFullId : '',
    boxContentPrevId : '',
    shape : null,
    fade : null,
  
    getBoxletElem : function () {
      return document.getElementById(this.boxId);
    },

    getTitleElem : function () {
      return document.getElementById(this.boxTitleId);
    },

    getContentFullElem : function () {
      return document.getElementById(this.boxContentFullId);
    },

    getContentPrevElem : function () {
      return document.getElementById(this.boxContentPrevId);
    },

    getState : function () {
      var elem = this.getBoxletElem();
      if (elem) { 
        return elemst.is(elem, 'content-preview') ? 'preview' : 'full';
      }
    },

    contentAnimFadeOut : function (fn) {
      var that = this,
          boxContentFullElem = that.getContentFullElem(),
          boxContentPrevElem = that.getContentPrevElem();

      that.fade = beast({ 
        frames : 6
      }).fade({
        classNameEnd : 'vis-hide',
        ease : 'end',
        elem : boxContentFullElem, 
        endop : 0
      }).fade({
        classNameEnd : 'vis-hide',
        ease : 'end',
        elem : boxContentPrevElem, 
        endop : 0
      }).init(fn);
    },

    contentAnimFadeIn : function (fn) {
      var that = this,
          boxContentFullElem = that.getContentFullElem();

      that.fade = beast({
        frames : 6
      }).fade({
        classNameEnd : 'vis-show',
        elem : boxContentFullElem, 
        endop : 100
      }).init(fn);
    },

    contentAnimFadeInPrev : function (fn) {
      var that = this,
          boxTitleElem = that.getTitleElem(),
          boxContentPrevElem = that.getContentPrevElem();

      that.fade = beast({
        frames : 6
      }).fade({
        classNameEnd : 'vis-show',
        elem : boxContentPrevElem, 
        endop : 100
      }).init(fn);
    },

    contentAnimGrowContentFull : function (fn) {
      var that = this,
          boxletElem = that.getBoxletElem(),
          boxTitleElem = that.getTitleElem(),
          boxContentFullElem = that.getContentFullElem(),
          boxContentPrevElem = that.getContentPrevElem();

      that.shape = beast({
        frames : 6
      }).shape({
        elem : boxContentFullElem,
        ease : 'end',
        whbgn : [null,0],
        classNameEnd : 'show-open'
      }).shape({
        elem : boxContentPrevElem,
        ease : 'end',
        whend : [null,0],
        classNameEnd : 'show-shut'
      }).init(fn);
    },

    contentAnimShrinkContentFull : function (fn) {
      var that = this,
          boxletElem = that.getBoxletElem(),
          boxTitleElem = that.getTitleElem(),
          boxContentFullElem = that.getContentFullElem(),
          boxContentPrevElem = that.getContentPrevElem();

      that.shape = beast({
        frames : 6
      }).shape({
        elem : boxContentFullElem,
        ease : 'end',
        whend : [null,0],
        classNameEnd : 'show-shut'
      }).shape({
        elem : boxContentPrevElem,
        ease : 'end',
        whbgn : [null,0],
        classNameEnd : 'show-open'
      }).init(fn);
    },

    showFull : function (fn) {
      var that = this,
          elem = that.getBoxletElem();

      that.contentAnimFadeOut(function (err, res) {
        if (err) return fn(err);
        that.contentAnimGrowContentFull(function (err, res) {
          if (err) return fn(err);
          that.contentAnimFadeIn(function (err, res) {
            if (err) return fn(err);
            elemst.up(elem, 'content-full');
            fn(null, 'done!');
          });          
        });
      });
    },

    showPrev : function (fn) {
      var that = this,
          elem = that.getBoxletElem();

      that.contentAnimFadeOut(function (err, res) {
        if (err) return fn(err);
        that.contentAnimShrinkContentFull(function (err, res) {
          if (err) return fn(err);
          that.contentAnimFadeInPrev(function (err, res) {
            if (err) return fn(err);
            elemst.up(elem, 'content-preview');
            fn(null, 'done!');
          });          
        })
      });
    },

    switchState : function (fn) {
      var that = this,
          boxletstate = that.getState();

      if (boxletstate === 'preview') {
        that.showFull(fn);
      } else { 
        that.showPrev(fn);
      }
    },

    attach : function () {
      var that = this, 
          boxTitleElem = that.getTitleElem();

      lsn(boxTitleElem, 'click', function (e) {
        that.reboundfn(function (exitfn) {
          that.switchState(function () {
            console.log('state is: ', that.getState());
            exitfn();
          });
        });
        return domev.stopDefaultAt(e);
      });
    }
  };

  var p = function (spec) {
    var that = Object.create(proto);
    that.boxId = spec.boxId;
    that.reboundfn = lockfn.Rebounding.getNew();
    that.boxTitleId = spec.boxTitleId;
    that.boxContentFullId = spec.boxContentFullId;
    that.boxContentPrevId = spec.boxContentPrevId;
    that.attach();
    return that;
  };

  p.proto = proto;

  return p;

}());
