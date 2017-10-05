// set the environment to test
process.env.NODE_ENV = 'test';

// dependencies for testing
const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const server = require("../server.js");


// Special rules for eslint //
/* eslint func-names: "off", prefer-arrow-callback: "off" */
/* globals describe it before */

// test the server connection
describe("server", function () {
    describe("GET /", function () {
        it("should return a web page", function (done) {
            chai.request(server)
                .get("/")
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("string");
                });
        });
    });
});
