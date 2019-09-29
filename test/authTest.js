const supertest = require("supertest");
const server = supertest.agent("http://localhost:8080");
const chai = require('chai');
var assert = chai.assert;
describe("Task test sign up and login", () => {
    var email = "weeksi" + (Math.random() * 1000) + "@outlook,com";



    it('checks the user can succesfully sign up', (done) => {
        server.post("/newUser").send({
                "email": email,
                "password": "mypassword"
            }).expect("Content-type", /json/)
            .expect(200).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(err, null);
                assert.equal(res.body.status, "success");
                assert.equal(res.body.newUserEmail, email);
                done();

            });
    });
    it('tests if the user can sign in with valid credentials', (done) => {
        server.post("/auth").send({
                "email": email,
                "password": "mypassword"
            }).expect("Content-type", /json/)
            .expect(200).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(err, null);
                assert.equal(res.body.status, "success");
                done();

            });


    });
    it('test the scenario where the user is trying to sign up but already exists', (done) => {
        server.post("/newUser").send({
                "email": email,
                "password": "mypassword"
            }).expect("Content-type", /json/)
            .expect(200).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(err, null);
                assert.equal(res.body.status, "user already exists");
                assert.equal(res.body.newUserEmail, email);
                done();

            });

    });
    it('test 400 error where request isnt per spec auth', (done) => {
        server.post("/auth").send({
                "bob": email,
                "gym": "mypassword"
            }).expect("Content-type", /json/)
            .expect(200).end((err, res) => {
                assert.equal(400, res.status);
                assert.equal(res.body.status, "Failed");
                assert.equal(res.body.error, "bad request should include keys email and password");
                done();

            });

    });
    it('test 400 error where request isnt per spec new user', (done) => {
        server.post("/newUser").send({
                "bob": email,
                "gym": "mypassword"
            }).expect("Content-type", /json/)
            .expect(200).end((err, res) => {
                assert.equal(400, res.status);
                assert.equal(res.body.status, "Failed");
                assert.equal(res.body.error, "bad request should include keys email and password");
                done();

            });

    });

});