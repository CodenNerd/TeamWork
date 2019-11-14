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
  
  const initialAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNjE4ZjYzMC1mZmJlLTExZTktOGU0NS1lM2UzYThlODFkNDEiLCJpYXQiOjE1NzM2ODAwNTAsImV4cCI6MTU3NDI4NDg1MH0.I8jH0LIybusX17Ck27TAGhkn_oYta3_cVJ-9VqocM9o`
  let email;
  let password;
  let employeeToken;
  let gifId;
  let articleId;
  describe('POST a new user', () => {
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



  // describe('POST a new gif', () => {

  //   it('should create a new gif', (done) => {

  //     request(app).post('/api/v1/gifs')
  //       .set('x-access-token', employeeToken)
  //       .field({ title: 'heydd', caption: 'oh yeah yes' })
  //       .attach('image', './test/testpic1.gif')
  //       .expect('Content-Type', /json/)
  //       .expect(201)
  //       .end((err, res) => {
  //         assert.equal(res.body.status, 'success');
  //         expect(res.body).to.have.property('data').and.property('message').to.equal('Gif uploaded successfully');
  //         expect(res.body).to.have.property('data').and.property('gifId');
  //         expect(res.body).to.have.property('data').and.property('createdOn');
  //         expect(res.body).to.have.property('data').and.property('title');
  //         expect(res.body).to.have.property('data').and.property('imageURL');
  //         expect(res.body).to.have.property('adult_content');

  //         gifId = res.body.data.gifId
  //         if (err) return done(err);
  //         done();

  //       })
  //   });

  //   it('should not create a new gif if uploaded image is not gif mimetype', (done) => {

  //     request(app).post('/api/v1/gifs')
  //       .set('x-access-token', employeeToken)
  //       .field({ title: 'hey', caption: 'oh yeah yes' })
  //       .attach('image', './test/testpic2.jpg')
  //       .expect('Content-Type', /json/)
  //       .expect(400)
  //       .end((err, res) => {
  //         assert.equal(res.body.status, 'error');
  //         expect(res.body).to.have.property('message').to.equal('Selected image must be GIF');

  //         if (err) return done(err);
  //         done();

  //       })
  //   });

  //   it('should not create a new gif if title is not provided', (done) => {

  //     request(app).post('/api/v1/gifs')
  //       .set('x-access-token', employeeToken)
  //       .field({ caption: 'oh yeah yes' })
  //       .attach('image', './test/testpic1.gif')
  //       .expect('Content-Type', /json/)
  //       .expect(400)
  //       .end((err, res) => {
  //         assert.equal(res.body.status, 'error');
  //         expect(res.body).to.have.property('message').to.equal('You need to provide a title');

  //         if (err) return done(err);
  //         done();

  //       })
  //   });

  //   it('should not create a new gif if gif is not provided', (done) => {

  //     request(app).post('/api/v1/gifs')
  //       .set('x-access-token', employeeToken)
  //       .field({ title: `Yess`, caption: 'oh yeah yes' })
  //       .attach('image', '')
  //       .expect('Content-Type', /json/)
  //       .expect(400)
  //       .end((err, res) => {
  //         assert.equal(res.body.status, 'error');
  //         expect(res.body).to.have.property('message').to.equal('No files were uploaded.');

  //         if (err) return done(err);
  //         done();

  //       })
  //   });

  // })



  // describe('POST share a gif', () => {
  //   it('should share a gif with an employee', (done) => {
  //     request(app).post(`/api/v1/gifs/${gifId}/share/f9041bb0-06fd-11ea-a416-47fb55786b9a`)
  //       .set('x-access-token', employeeToken)
  //       .expect('Content-Type', /json/)
  //       .expect(201)
  //       .end((err, res) => {
  //         assert.equal(res.body.status, 'success');
  //         expect(res.body).to.have.property('message').to.equal('GIF shared successfully');

  //         if (err) return done(err);
  //         done();

  //       })
  //   });


  //   it('should not share a gif if id params is wrong', (done) => {
  //     request(app).post(`/api/v1/gifs/${gifId}/share/f9041bb0-06fd-11ea-a416-47fb55786b9`)
  //       .set('x-access-token', employeeToken)
  //       .expect('Content-Type', /json/)
  //       .expect(400)
  //       .end((err, res) => {
  //         assert.equal(res.body.status, 'error');
  //         expect(res.body).to.have.property('message').to.equal('Wrong gif ID or recipient ID');

  //         if (err) return done(err);
  //         done();

  //       })
  //   });

  //   it('should not share a gif if gif does not exist', (done) => {
  //     request(app).post(`/api/v1/gifs/f9041bb0-06fd-11ea-a416-47fb55786b9a/share/f9041bb0-06fd-11ea-a416-47fb55786b9a`)
  //       .set('x-access-token', employeeToken)
  //       .expect('Content-Type', /json/)
  //       .expect(400)
  //       .end((err, res) => {
  //         assert.equal(res.body.status, 'error');
  //         expect(res.body).to.have.property('message').to.equal('gif not found');

  //         if (err) return done(err);
  //         done();

  //       })
  //   });

  //   it('should not share a gif if recipient does not exist', (done) => {
  //     request(app).post(`/api/v1/gifs/${gifId}/share/f9041bb0-06fd-11ea-a416-47fb55786b9b`)
  //       .set('x-access-token', employeeToken)
  //       .expect('Content-Type', /json/)
  //       .expect(400)
  //       .end((err, res) => {
  //         assert.equal(res.body.status, 'error');
  //         expect(res.body).to.have.property('message').to.equal('recipient not found');

  //         if (err) return done(err);
  //         done();

  //       })
  //   });

  // })



  describe('POST a new article', () => {
    const article = {
      title: `Testing`,
      content: `djdd sdkd`,
      tag: `tech`
    }
    it('should create a new article', (done) => {
      request(app).post('/api/v1/articles')
        .set('x-access-token', employeeToken)
        .send(article)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('data').and.property('message').to.equal('Article posted successfully');
          expect(res.body).to.have.property('data').and.property('articleId');
          expect(res.body).to.have.property('data').and.property('createdOn');
          expect(res.body).to.have.property('data').and.property('title');
          expect(res.body).to.have.property('data').and.property('tag');

          articleId = res.body.data.articleId;
          if (err) return done(err);
          done();

        })
    });

    it('should not create a new article if title is not provided', (done) => {

      request(app).post('/api/v1/articles')
        .set('x-access-token', employeeToken)
        .send({content:`dd ds`, tag: `biz` })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('title must be provided');

          if (err) return done(err);
          done();

        })
    });

    it('should not create a new article if content is not provided', (done) => {

      request(app).post('/api/v1/articles')
        .set('x-access-token', employeeToken)
        .send({title:`dd ds`, tag: `biz` })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('content must be provided');

          if (err) return done(err);
          done();

        })
    });

    it('should not create a new article if tag is not provided', (done) => {

      request(app).post('/api/v1/articles')
        .set('x-access-token', employeeToken)
        .send({title:`dd ds`, content: `biz` })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('tag must be provided');

          if (err) return done(err);
          done();

        })
    });

    it('should not create a new article if title is not valid', (done) => {

      request(app).post('/api/v1/articles')
        .set('x-access-token', employeeToken)
        .send({title:`m`, content: `biz`, tag: `ffs` })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('"title" length must be at least 3 characters long');

          if (err) return done(err);
          done();

        })
    });
   
  })


  describe('POST share an article', () => {
    it('should share an article with an employee', (done) => {
      request(app).post(`/api/v1/articles/${articleId}/share/f9041bb0-06fd-11ea-a416-47fb55786b9a`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('message').to.equal('article shared successfully');

          if (err) return done(err);
          done();

        })
    });


    it('should not share an article if id params is wrong', (done) => {
      request(app).post(`/api/v1/articles/${articleId}/share/f9041bb0-06fd-11ea-a416-47fb55786b9`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Wrong article ID or recipient ID');

          if (err) return done(err);
          done();

        })
    });

    it('should not share an article if article does not exist', (done) => {
      request(app).post(`/api/v1/articles/f9041bb0-06fd-11ea-a416-47fb55786b9a/share/f9041bb0-06fd-11ea-a416-47fb55786b9a`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('article not found');

          if (err) return done(err);
          done();

        })
    });

    it('should not share an article if recipient does not exist', (done) => {
      request(app).post(`/api/v1/articles/${articleId}/share/f9041bb0-06fd-11ea-a416-47fb55786b9b`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('recipient not found');

          if (err) return done(err);
          done();

        })
    });

  })


  describe('PATCH edit an article', () => {
    const article = {
      title: `Testing edit`,
      content: `djdd sdkdh`,
      tag: `tech`
    }
    it('should edit an existing article', (done) => {
      request(app).patch(`/api/v1/articles/${articleId}`)
        .set('x-access-token', employeeToken)
        .send(article)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('data').and.property('message').to.equal('Article updated successfully');
          expect(res.body).to.have.property('data').and.property('articleId');
          expect(res.body).to.have.property('data').and.property('createdOn');
          expect(res.body).to.have.property('data').and.property('title');
          expect(res.body).to.have.property('data').and.property('tag');

          
          if (err) return done(err);
          done();

        })
    });

     it('should not edit an existing article if article does not exist', (done) => {
      request(app).patch(`/api/v1/articles/${gifId}`)
      .set('x-access-token', employeeToken)
      .send(article)
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('could not verify article');

          if (err) return done(err);
          done();

        })
    });

    it('should not edit an existing article if req is not made by an employee', (done) => {
      request(app).patch(`/api/v1/articles/${articleId}`)
      .set('x-access-token', initialAuthToken)
      .send(article)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('please create an employee account to perform this task');

          if (err) return done(err);
          done();

        })
    });


    it('should not edit an existing article if title is not provided', (done) => {
      request(app).patch(`/api/v1/articles/${articleId}`)
      .set('x-access-token', employeeToken)
      .send({content:`dd ds`, tag: `biz` })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('title must be provided');

          if (err) return done(err);
          done();

        })
    });

   
  })

  describe('DELETE remove an article', () => {
    
    it('should delete an existing article', (done) => {
      request(app).delete(`/api/v1/articles/${articleId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.response).to.have.property('deleteArticle').and.property('status').to.equal('success');
          expect(res.body.response).to.have.property('deleteArticle').and.property('data').and.property('message').to.equal('Article successfully deleted');
          expect(res.body.response).to.have.property('deleteComments').and.property('status').to.equal('success');
          expect(res.body.response).to.have.property('deleteComments').and.property('data').and.property('message').to.equal('Article comments successfully deleted');
          expect(res.body.response).to.have.property('deleteLikes').and.property('status').to.equal('success');
          expect(res.body.response).to.have.property('deleteLikes').and.property('data').and.property('message').to.equal('Article likes successfully deleted');
          
          if (err) return done(err);
          done();

        })
    });

    it('should not delete article if id param is wrong', (done) => {
      request(app).delete(`/api/v1/articles/12345`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
         expect(res.body).to.have.property('message').to.equal('could not verify article');
          
          if (err) return done(err);
          done();

        })
    });

    

   
  })

})
