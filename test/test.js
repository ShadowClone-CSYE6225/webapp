const supertest = require("supertest");
const should = require("should");
const dotenv = require('dotenv');
  
dotenv.config();

// This agent refers to PORT where program is runninng.
const PORT = process.env.PORT || 3200
var server = supertest.agent(`http://localhost:${PORT}`);

console.log(PORT);


// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page

  it("Should return response status of 200",function(done){

    // calling home page api
    server
    .get("/healthz")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,response){
      // HTTP status should be 200
      response.status.should.equal(200);
      done();
    });
  });

});