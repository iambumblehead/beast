// Filename: beast-test.js
// Timestamp: 2014.05.11-16:38:01 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: beast.js, beast-test-boxlet.js

var test = {
  init : function () {

    // building an advanced component around beast
    var boxlet1 = boxlet({
      boxId : 'Boxlet',
      boxTitleId : 'BoxTitle',
      boxContentFullId : 'BoxContentFull',
      boxContentPrevId : 'BoxContentPrev'
    });

    var boxlet2 = boxlet({
      boxId : 'Boxlet2',
      boxTitleId : 'BoxTitle2',
      boxContentFullId : 'BoxContentFull2',
      boxContentPrevId : 'BoxContentPrev2'
    });

    var elem = document.getElementById('Boxlet');

    // simple beast usage
    window.testmove = function () {
      beast({ 
        frames : 30 
      }).move({ 
        elem : elem, 
        ltend : [300, 200] 
      }).init();
    };

    window.testfade = function () {
      beast({ 
        frames : 30 
      }).fade({ 
        elem : elem, 
        opend : 0
      }).init();
    };

    window.testshape = function () {
      beast({ 
        frames : 30 
      }).shape({ 
        elem : elem, 
        ease : 'bgn',
        whend : [300, 200] 
      }).init();
    };

    window.testcolor = function () {
      beast({ 
        frames : 30 
      }).color({ 
        elem : elem, 
        ease : 'end',
        bgnColor : '#fff',
        endColor : '#259c14',
        bgnBackgroundColor : 'rgb(255, 0, 0)',
        endBackgroundColor : 'rgb(0, 0, 0)'
      }).init();
    };

    window.go = function () {
      testmove();
      testfade();
      testshape();
      testcolor();
    };
  }
};

