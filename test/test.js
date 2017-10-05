// set the environment to test
process.env.NODE_ENV = 'test';

// dependencies for testing
const assert = require("assert");
const request = require("request");

// Special rules for eslint //
/* eslint func-names: "off", prefer-arrow-callback: "off" */
/* globals describe it before */

// example code from mocha docs
describe("Example: Array", function () {
    describe("#indexOf()", function () {
        it("should return -1 when the value is not present", function () {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});

// test the server connection
describe("server", function () {
    const baseUrl = `http://localhost:${process.env.PORT || 8080}/`;
    let server;
    let httpResponse; 
    let httpBody;

    // start the server before running tests
    before(function () {
        server = require("../server.js"); // eslint-disable-line global-require
    });


    // make sure the base url is defined before testing any routes
    describe("base url", function () {
        it("should be defined", function () {
            assert.ok(typeof baseUrl !== "undefined");
        });
    });

    // send a get request to root
    before(function (beforeDone) {
        request(baseUrl, function (error, response, body) {
            if (error) { beforeDone(error); }
            httpResponse = response;
            httpBody = body;
            beforeDone();
        });
    });

    // test get method for root
    describe("GET /", function () {
        it("status code should be 200", function () {
            assert.ok(httpResponse.statusCode === 200);
        });
    });
});
