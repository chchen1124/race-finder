// dependencies for testing
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

// set the environment to test
process.env.NODE_ENV = 'test';
const server = require("../server.js");

chai.use(chaiHttp);

// Special rules for eslint //
/* eslint func-names: "off", prefer-arrow-callback: "off" */
/* globals describe expect it */

// test the server connection
describe("server", function () {
    describe("GET /", function () {
        it("should return ok status", function (done) {
            chai.request(server)
                .get("/")
                .end(function (err, res) {
                    chai.expect(err).to.be.an("null");
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
