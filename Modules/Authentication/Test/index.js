var expect = require('chai').expect;
var request = require('supertest');

var server = request.agent("http://localhost:5000");
// UNIT test begin
let token =  ''

function random(low, high) {
    return Math.random() * (high - low) + low
}

const registerCredentials = {
    email:  random(1, 10)+'test@gmail.com',
    password: '123456',
    title: "Mr",
    user_type: 'admin',
    first_name: 'Test',
    last_name: 'Cases'
}
const userCredentials = {
    email: registerCredentials.email,
    password: registerCredentials.password
}

describe('Register API', function() {
    it('Should success if user registration is valid', function(done) {
        server
            .post('/api/register')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(registerCredentials)
            .expect(201)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                token = response.body.user.temporarytoken
                expect(response.statusCode).to.equal(201);
                expect(response.body).to.be.an('object');
                expect(response.body.user).to.exist;
            })
            .end(done);
    });
});

describe('Activate User API', function() {
    it('Should success if user activation is valid', function(done) {
        server
            .patch('/api/activate/'+ token)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(201)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.statusCode).to.equal(201);
                expect(response.body).to.be.an('object');
                expect(response.body.user).to.exist;
            })
            .end(done);
    });
});

describe('Login API', function() {
    it('Should success if credential is valid', function(done) {
        server
            .post('/api/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(userCredentials)
            .expect(201)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                token = response.body.token
                expect(response.statusCode).to.equal(201);
                expect(response.body).to.be.an('object');
                expect(response.body.token).to.exist;
            })
            .end(done);
    });
});



// describe('Logout User API', function() {
//     it('Should success if logout is valid', function(done) {
//         server
//             .get('/api/logout')
//             .set('Accept', 'application/json')
//             .set('Content-Type', 'application/json')
//             .set('Authorization' , token)
//             .expect(201)
//             .expect('Content-Type', /json/)
//             .expect(function(response) {
//                 expect(response.statusCode).to.equal(201);
//                 expect(response.body).to.be.an('object');
//                 expect(response.body.msg).to.exist;
//             })
//             .end(done);
//     });
// });