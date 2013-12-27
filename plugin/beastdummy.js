// Filename: beastdummy.js  
// Timestamp: 2013.12.26-21:24:23 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: beastplug.js
//
//
// a dummy 'plugin' for reference and tests
//

var beastplug = require('./beastplug.js');

beastplug('dummy', function (b) {
  b.init = function () { console.log('init'); };

  b.kill = function () { console.log('kill'); };

  b.complete = function () { console.log('complete'); };
});
