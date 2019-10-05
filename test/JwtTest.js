const supertest = require("supertest");
const server = supertest.agent("http://localhost:8080");
const chai = require('chai');
var assert = chai.assert;
describe("Test JWT tokens", () => {
    var email = "weeksi" + (Math.random() * 1000) + "@outlook,com";
    it('No Token Provided', (done) => {
        server.post("/").send({
            "email": email,
            "password": "mypassword"
        }).expect("Content-type", /json/).expect(401).end((err, res) => {
            assert.equal(res.status, 401);
            assert.equal(err, null);
            assert.equal(res.body.auth, false);
            assert.equal(res.body.message, "No token provided");
            done();

        });
    });
    it('Incorrect token or token with wrong algo', (done) => {
        var token = 'eyJhbGciOiJSUzM4NCIsInR5cCI6IkpXVCJ9.eyJpZGVuaXR5Ijoid2Vla3NpMTk5OUBvdXRsb29rLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.Bc68Zt8saR1L5Tg7kLv1HQe4xfgXM_pwyIwd2Z_l5aLQ_IT3WG0VI0TrKgrUtUG4xF3q1pnqtsI5xy03R3yDiUwgU5Gic6f9wOmf5kWGFAWd-z2MqYs3W2BTexApFxUUpfOuJPHn7aoo66FYF3LmupTRUDT1Smcq29DCLjN2lcTF7Boe-Ijf4K7W_-81_MYuYpwvcHRNVgws9qs1yFE12kTn8P_MN0utG4JxjN0ftG1ASM-KH7jmsE52jMctX6xpQD8qiVAdM_zkT8xYAB2X4QKShxeL29vszydkENTW6z0CqgEAwt_M6MGx-KjcYzYSyxlkg3qGXj91VBHmT9l-ag';
        server.post("/").set('authorization', 'Bearer ' + token).send({
            "email": email,
            "password": "mypassword"
        }).expect("Content-type", /json/).expect(403).end((err, res) => {
            assert.equal(res.status, 403);
            assert.equal(err, null);
            assert.equal(res.body.auth, false);
            assert.equal(res.body.message, "invalid token");
            done();

        });
    });
    it('token expired', (done) => {
        var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6IndlZWtzaTE5OTlAb3V0bG9vay5jb20iLCJpYXQiOjE1NzAyNzc2NjIsImV4cCI6MTU3MDI3NzY2M30.pJZjXSzuabAdQTuN1MryfFN7-ymuvy7XotAnXswFGn53R7TUmJygm1YCkHW1vp28UYslXOya5doygLn9MhNiLg';
        server.post("/").set('authorization', 'Bearer ' + token).send({
            "email": email,
            "password": "mypassword"
        }).expect("Content-type", /json/).expect(403).end((err, res) => {
            assert.equal(res.status, 403);
            assert.equal(err, null);
            assert.equal(res.body.auth, false);
            assert.equal(res.body.message, "token expired");
            done();

        });
    });
    it('token payload does not match our records', (done)=>{
        var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVuaXR5Ijoid2Vla3NpZG9uYWxkQG91dGxvb2suY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.dHK9S-bQZUx5C6gmB9yPsPCk4eUGuv92VlCRhyMs6bvHJEH_xRk7n-aQ0Jxs7mIxViJfiL0JKZyQp_BhPiRT7w';
        server.post("/").set('authorization', 'Bearer ' + token).send({
            "email": email,
            "password": "mypassword"
        }).expect("Content-type", /json/).expect(403).end((err, res) => {
            assert.equal(res.status, 403);
            assert.equal(err, null);
            assert.equal(res.body.auth, false);
            assert.equal(res.body.message, "unable to validate token");
            done();

        });

    });

    it('bad token format', (done)=>{
        var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVuaXR5Ijoid2Vla3NpZG9uYWxkQG91dGxvb2suY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.dHK9S-bQZUx5C6gmB9yPsPCk4eUGuv92VlCRhyMs6bvHJEH_xRk7n-aQ0Jxs7mIxViJfiL0JKZyQp_BhPiRT7w';
        server.post("/").set('authorization',  token).send({
            "email": email,
            "password": "mypassword"
        }).expect("Content-type", /json/).expect(400).end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(err, null);
            assert.equal(res.body.auth, false);
            assert.equal(res.body.message, "bad token format");
            done();

        });

    });






});