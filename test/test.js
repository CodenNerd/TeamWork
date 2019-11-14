import 'babel-polyfill';
import { assert, expect } from 'chai';
import app from '../app';
import request from 'supertest';

describe('TeamWork App', () => {
  describe('GET an uncovered route', () => {
    it('should show an error object', (done) => {
      request(app).get('/unknown')
        .end((err, res) => {
          assert.equal(res.body.status, 'error')
          assert.equal(res.body.message, 'page not found');
          done();
        })
    });
  })
  let email;
  let password;
  let employeeToken;
  describe('POST a new user', () => {
    const initialAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNjE4ZjYzMC1mZmJlLTExZTktOGU0NS1lM2UzYThlODFkNDEiLCJpYXQiOjE1NzM2ODAwNTAsImV4cCI6MTU3NDI4NDg1MH0.I8jH0LIybusX17Ck27TAGhkn_oYta3_cVJ-9VqocM9o`
    it('should create a new user', (done) => {
      const user = {
        firstName: 'AbdulAzeez',
        lastName: 'Atanda',
        email: `rand${Math.random()}@gmail.com`,
        password: `sssdd`,
        gender: `male`,
        jobRole: `Dev`,
        userType: `employee`,
        department: `Software`,
        address: `Ojota, Lagos`
      }
      email = user.email;
      password = user.password;
      request(app).post('/api/v1/auth/create-user')
        .set('x-access-token', initialAuthToken)
        .send(user)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('data').and.property('message');
          expect(res.body.data).to.have.property('token');
          employeeToken = res.body.data.token;
          if (err) return done(err);
          done();
        })
    });

    it('should not create user if values are not provided ', (done) => {
      request(app).post('/api/v1/auth/create-user')
        .set('x-access-token', initialAuthToken)
        .end((err, res) => {
          assert.equal(res.body.status, 'error')
          expect(res.body).to.have.property('message').to.equal('"firstName" is required');

          if (err) return done(err);

          done();
        })
    });

    it('should not create user if user is not admin ', (done) => {
      request(app).post('/api/v1/auth/create-user')
        .set('x-access-token', employeeToken)
        .end((err, res) => {
          assert.equal(res.body.status, 'error')
          assert.equal(res.body.message, 'you are not authorized to do this');
          if (err) return done(err);

          done();
        })
    });

    it('should not create user if input email already exists in db ', (done) => {
      const user = {
        firstName: 'AbdulAzeez',
        lastName: 'Atanda',
        email,
        password: `sssdd`,
        gender: `male`,
        jobRole: `Dev`,
        userType: `employee`,
        department: `Software`,
        address: `Ojota, Lagos`
      }
      request(app).post('/api/v1/auth/create-user')
        .set('x-access-token', initialAuthToken)
        .send(user)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error')
          assert.equal(res.body.message, `A user with email: ${email} already exists`);
          done();
        })
    });
  })


  describe('POST /auth/signin', () => {

    it('should sign in an employee', (done) => {
      const user = {
        email,
        password
      }
      request(app).post('/api/v1/auth/signin')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(202)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('data').and.property('message');
          expect(res.body.data).to.have.property('token');
          employeeToken = res.body.data.token;
          if (err) return done(err);
          done();
        })
    });

    it('should not sign in if values are not provided ', (done) => {
      request(app).post('/api/v1/auth/signin')
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error')
          expect(res.body).to.have.property('message').to.equal('Some values are missing');

          if (err) return done(err);

          done();
        })
    });

    it('should not sign in if email is invalid', (done) => {
      const user = {
        email: `cjjsj`,
        password: `sssdd`
      }
      request(app).post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          assert.equal(res.body.status, 'error')
          assert.equal(res.body.message, 'Please enter a valid email address');
          if (err) return done(err);

          done();
        })
    });

    it('should not sign in if input credentials is not found in db ', (done) => {
      const user = {
        email,
        password: `sssppdd`,
      }
      request(app).post('/api/v1/auth/signin')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error')
          assert.equal(res.body.message, `Wrong credentials provided`);
          done();
        })
    });
  })



})
