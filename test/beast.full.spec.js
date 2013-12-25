// Filename: beast.full.spec.js  
// Timestamp: 2013.12.24-19:34:44 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
//
// tests here are minimal. tests will be added as issues are discovered.

var beast = require('../beast.js');
var beastdummy = require('../plugin/beastdummy.js');

describe("beast", function () {
  it("should construct an object", function () {

    var b = beast({
      frames : 30,
      fps : 10
    });

    expect( b.fpms ).toBe( 10 / 1000 );
  });
});

