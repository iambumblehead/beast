var scroungejs = require('scroungejs'),
    startutils = require('./startutil');

startutils.createFileIfNotExist({
  pathSrc : './test/indexSrc.html',
  pathFin : './test/index.html'
}, function (err, res) {
  if (err) return console.log(err);

  var scroungeTestOpts,
      scroungeMinOpts,
      scroungeUnminOpts;

  scroungeTestOpts = {
    inputPath : [
      './test/testbuildSrc',
      './node_modules',
      './plugin',
      './beast.js'
    ],
    outputPath : './test/testbuildFin', 
    isRecursive : true,
    isSourcePathUnique : true,
    isCompressed : false,
    isConcatenated : false,
    basepage : './test/index.html'
  };

  scroungeTestOpts = {
    inputPath : [
      './test/testbuildSrc',
      './node_modules',
      './plugin',
      './beast.js'
    ],
    outputPath : './test/testbuildFin', 
    isRecursive : true,
    isSourcePathUnique : true,
    isCompressed : false,
    isConcatenated : false,
    basepage : './test/index.html'
  };

  scroungeMinOpts = Object.create(scroungeTestOpts);
  scroungeMinOpts.basepage = '';
  scroungeMinOpts.trees = ["beast.full.js"];
  scroungeMinOpts.outputPath = './beast.min.js';
  scroungeMinOpts.isCompressed = true;
  scroungeMinOpts.isConcatenated = true;
  scroungeMinOpts.isLines = false;

  scroungeUnminOpts = Object.create(scroungeTestOpts);
  scroungeUnminOpts.basepage = '';
  scroungeUnminOpts.trees = ["beast.full.js"];
  scroungeUnminOpts.outputPath = './beast.unmin.js';
  scroungeUnminOpts.isCompressed = false;
  scroungeUnminOpts.isConcatenated = true;

  scroungejs.build(scroungeTestOpts, function (err, res) {
    if (err) return console.log(err);

    // build a minified version
    scroungejs.build(scroungeMinOpts, function (err, res) {
      if (err) return console.log(err);

      // build a minified version
      scroungejs.build(scroungeUnminOpts, function (err, res) {
        if (err) return console.log(err);
        console.log('done');
      });
    });
  });

});
