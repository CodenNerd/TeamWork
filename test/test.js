import 'babel-polyfill';
import { assert, expect } from 'chai';
import app from '../app';
import request from 'supertest';

describe('TeamWork App', () => {
  
  let initialAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNjE4ZjYzMC1mZmJlLTExZTktOGU0NS1lM2UzYThlODFkNDEiLCJpYXQiOjE1NzM2ODAwNTAsImV4cCI6MTU3NDI4NDg1MH0.I8jH0LIybusX17Ck27TAGhkn_oYta3_cVJ-9VqocM9o`
  const fakeId = `69f045c0-0725-11ea-a601-c96ff4552740`;
  let email;
  let password;
  let employeeToken;
  let gifId;
  let articleId;
  let employeeId;
  let likeId;
  let commentId;
  let flagId;

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
  
  

  describe('POST /auth/signin', () => {

    it('should sign in an admin', (done) => {
      const user = {
        email: `aatanda.dammy@gmail.com`,
        password: `atanda`
      }
      request(app).post('/api/v1/auth/signin')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(202)
        .end((err, res) => {
          console.log(res.body)
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('data').and.property('message');
          expect(res.body.data).to.have.property('token');
          initialAuthToken = res.body.data.token;
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
        email: `aatanda.dammy@gmail.com`,
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


  describe('GET all employees', () => {
    
    it('should retrieve all employees', (done) => {
      request(app).get(`/api/v1/employees`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0]).to.have.property('firstname');
          expect(res.body.data[0]).to.have.property('lastname');
          expect(res.body.data[0]).to.have.property('email');

          employeeId = res.body.data[0].id;
          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve employees if user is not an employee', (done) => {
      request(app).get(`/api/v1/employees`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'please create an employee account to perform this task');

          if (err) return done(err);
          done();

        })
    });
  })


  describe('GET one employee', () => {
    
    it('should retrieve a specific employee', (done) => {
      request(app).get(`/api/v1/employees/${employeeId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data).to.have.property('id').to.equal(employeeId);
          expect(res.body.data).to.have.property('firstname');
          expect(res.body.data).to.have.property('lastname');
          expect(res.body.data).to.have.property('email');

          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve a employee if user is not an employee', (done) => {
      request(app).get(`/api/v1/employees/${employeeId}`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'please create an employee account to perform this task');

          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve an employee if employee is not found', (done) => {
      request(app).get(`/api/v1/employees/69f045c0-0725-11ea-a601-c96ff4552740`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'Employee not found.');

          if (err) return done(err);
          done();

        })
    });
  })

  describe('POST a new gif', () => {

    it('should create a new gif', (done) => {

      request(app).post('/api/v1/gifs')
        .set('x-access-token', employeeToken)
        .field({ title: 'heydd', caption: 'oh yeah yes' })
        .attach('image', './test/testpic1.gif')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('data').and.property('message').to.equal('Gif uploaded successfully');
          expect(res.body).to.have.property('data').and.property('gifId');
          expect(res.body).to.have.property('data').and.property('createdOn');
          expect(res.body).to.have.property('data').and.property('title');
          expect(res.body).to.have.property('data').and.property('imageURL');
          expect(res.body).to.have.property('adult_content');

          gifId = res.body.data.gifId
          if (err) return done(err);
          done();

        })
    });

    it('should not create a new gif if uploaded image is not gif mimetype', (done) => {

      request(app).post('/api/v1/gifs')
        .set('x-access-token', employeeToken)
        .field({ title: 'hey', caption: 'oh yeah yes' })
        .attach('image', './test/testpic2.jpg')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Selected image must be GIF');

          if (err) return done(err);
          done();

        })
    });

    it('should not create a new gif if title is not provided', (done) => {

      request(app).post('/api/v1/gifs')
        .set('x-access-token', employeeToken)
        .field({ caption: 'oh yeah yes' })
        .attach('image', './test/testpic1.gif')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('You need to provide a title');

          if (err) return done(err);
          done();

        })
    });

    it('should not create a new gif if gif is not provided', (done) => {

      request(app).post('/api/v1/gifs')
        .set('x-access-token', employeeToken)
        .field({ title: `Yess`, caption: 'oh yeah yes' })
        .attach('image', '')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('No files were uploaded.');

          if (err) return done(err);
          done();

        })
    });

  })



  describe('POST share a gif', () => {
    it('should share a gif with an employee', (done) => {
      request(app).post(`/api/v1/gifs/${gifId}/share/${employeeId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          console.log(res.body)
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('message').to.equal('GIF shared successfully');

          if (err) return done(err);
          done();

        })
    });


    it('should not share a gif if id params is wrong', (done) => {
      request(app).post(`/api/v1/gifs/${gifId}/share/f9041bb0-06fd-11ea-a416-47fb55786b9`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Wrong gif ID or recipient ID');

          if (err) return done(err);
          done();

        })
    });

    it('should not share a gif if gif does not exist', (done) => {
      request(app).post(`/api/v1/gifs/f9041bb0-06fd-11ea-a416-47fb55786b9a/share/f9041bb0-06fd-11ea-a416-47fb55786b9a`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('gif not found');

          if (err) return done(err);
          done();

        })
    });

    it('should not share a gif if recipient does not exist', (done) => {
      request(app).post(`/api/v1/gifs/${gifId}/share/f9041bb0-06fd-11ea-a416-47fb55786b9b`)
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
      request(app).post(`/api/v1/articles/${articleId}/share/${employeeId}`)
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

    //  it('should not edit an existing article if article does not exist', (done) => {
    //   request(app).patch(`/api/v1/articles/${gifId}`)
    //   .set('x-access-token', employeeToken)
    //   .send(article)
    //     .expect('Content-Type', /json/)
    //     .expect(401)
    //     .end((err, res) => {
    //       assert.equal(res.body.status, 'error');
    //       expect(res.body).to.have.property('message').to.equal('could not verify article as yours');

    //       if (err) return done(err);
    //       done();

    //     })
    // });

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

 
  describe('POST a new article comment', () => {
    const commentBody = {
      commentBody: `Nice`
    }
    it('should create an article comment', (done) => {
      request(app).post(`/api/v1/articles/${articleId}/comments`)
        .set('x-access-token', employeeToken)
        .send(commentBody)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('data').and.property('message').to.equal('comment posted successfully');
          expect(res.body).to.have.property('data').and.property('articleTitle');
          expect(res.body).to.have.property('data').and.property('createdOn');
          expect(res.body).to.have.property('data').and.property('article');
          expect(res.body).to.have.property('data').and.property('commentBody');

          if (err) return done(err);
          done();

        })
    });


    it('should not create an article comment if article id is invalid uuid', (done) => {
      request(app).post(`/api/v1/articles/${articleId}12s/comments`)
        .set('x-access-token', employeeToken)
        .send(commentBody)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'invalid credentials provided');
          

          if (err) return done(err);
          done();

        })
    });

    it('should not create an article comment if comment body is not a string', (done) => {
      request(app).post(`/api/v1/articles/${articleId}/comments`)
        .set('x-access-token', employeeToken)
        .send({commentBody: 123})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, '"commentBody" must be a string');
          

          if (err) return done(err);
          done();

        })
    }); 

    it('should not create an article comment if article is not found', (done) => {
      request(app).post(`/api/v1/articles/69f045c0-0725-11ea-a601-c96ff4552740/comments`)
        .set('x-access-token', employeeToken)
        .send(commentBody)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {

          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'article not found');
          
          if (err) return done(err);
          done();

        })
    });
  
   
  })


  describe('POST a new gif comment', () => {
    const commentBody = {
      commentBody: `Nice`
    }
    it('should create an gif comment', (done) => {
      request(app).post(`/api/v1/gifs/${gifId}/comments`)
        .set('x-access-token', employeeToken)
        .send(commentBody)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body).to.have.property('data').and.property('message').to.equal('comment posted successfully');
          expect(res.body).to.have.property('data').and.property('gifTitle');
          expect(res.body).to.have.property('data').and.property('createdOn');
          expect(res.body).to.have.property('data').and.property('commentBody');

          if (err) return done(err);
          done();

        })
    });


    it('should not create a gif comment if gif id is invalid uuid', (done) => {
      request(app).post(`/api/v1/gifs/${gifId}12s/comments`)
        .set('x-access-token', employeeToken)
        .send(commentBody)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'invalid credentials provided');
          

          if (err) return done(err);
          done();

        })
    });

    it('should not create a gif comment if comment body is not a string', (done) => {
      request(app).post(`/api/v1/gifs/${gifId}/comments`)
        .set('x-access-token', employeeToken)
        .send({commentBody: 123})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, '"commentBody" must be a string');
          

          if (err) return done(err);
          done();

        })
    }); 

    it('should not create a gif comment if gif is not found', (done) => {
      request(app).post(`/api/v1/gifs/69f045c0-0725-11ea-a601-c96ff4552740/comments`)
        .set('x-access-token', employeeToken)
        .send(commentBody)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'gif not found');
          
          if (err) return done(err);
          done();

        })
    });
  
   
  })


describe('GET all posts', () => {
    
    it('should retrieve all feed', (done) => {
      request(app).get(`/api/v1/feed`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0]).to.have.property('title');
          expect(res.body.data[0]).to.have.property('createdon');
          expect(res.body.data[0]).to.have.property('authorid');

          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve feed if user is not an employee', (done) => {
      request(app).get(`/api/v1/feed`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'please create an employee account to perform this task');

          if (err) return done(err);
          done();

        })
    });
  })




  describe('GET one article', () => {
    
    it('should retrieve a specific article', (done) => {
      request(app).get(`/api/v1/articles/${articleId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('title');
          expect(res.body.data).to.have.property('createdOn');
          expect(res.body.data).to.have.property('article');
          expect(res.body.data).to.have.property('likes');
          expect(res.body.data).to.have.property('comments');
          commentId = res.body.data.comments[0].commentid
          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve an article if user is not an employee', (done) => {
      request(app).get(`/api/v1/articles/${articleId}`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'please create an employee account to perform this task');

          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve an article if article is not found', (done) => {
      request(app).get(`/api/v1/articles/69f045c0-0725-11ea-a601-c96ff4552740`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'Article not found');

          if (err) return done(err);
          done();

        })
    });
  })




  describe('GET one gif', () => {
    
    it('should retrieve a specific gif', (done) => {
      request(app).get(`/api/v1/gifs/${gifId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('title');
          expect(res.body.data).to.have.property('createdOn');
          expect(res.body.data).to.have.property('url');
          expect(res.body.data).to.have.property('likes');
          expect(res.body.data).to.have.property('comments');

          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve a gif if user is not an employee', (done) => {
      request(app).get(`/api/v1/gifs/${gifId}`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'please create an employee account to perform this task');

          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve a gif if gif is not found', (done) => {
      request(app).get(`/api/v1/gifs/69f045c0-0725-11ea-a601-c96ff4552740`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'Gif not found.');

          if (err) return done(err);
          done();

        })
    });
  })


  


  describe('POST like a post', () => {
    let likedposttype = `article`;

    it('should like a particular post', (done) => {
      request(app).post(`/api/v1/posts/${articleId}/likes`)
        .set('x-access-token', employeeToken)
        .send({likedposttype: 'article'})
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data).to.have.property('message').to.equal('post liked successfully');
          
          if (err) return done(err);
          done();

        })
    });

    it('should not like a post which has already been liked', (done) => {
      request(app).post(`/api/v1/posts/${articleId}/likes`)
        .set('x-access-token', employeeToken)
        .send({likedposttype: 'article'})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('post liked already');
          
          if (err) return done(err);
          done();

        })
    });

    it('should not like a post if likedposttype is wrong', (done) => {
      request(app).post(`/api/v1/posts/${articleId}/likes`)
        .set('x-access-token', employeeToken)
        .send({likedposttype: 'whatever'})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Wrong post type');
          
          if (err) return done(err);
          done();

        })
    });
    

    it('should not like a post if liked post id is invalid uuid', (done) => {
      request(app).post(`/api/v1/posts/123345/likes`)
        .set('x-access-token', employeeToken)
        .send({likedposttype: 'article'})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Wrong postID');
          
          if (err) return done(err);
          done();

        })
    });

    it('should not like a post if liked post does not exist', (done) => {
      request(app).post(`/api/v1/posts/${fakeId}/likes`)
        .set('x-access-token', employeeToken)
        .send({likedposttype: 'article'})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal(`${likedposttype} not found`);
          
          if (err) return done(err);
          done();

        })
    });

  })


  describe('GET retrieve likes for a post', () => {
    
    it('should retrieve likes', (done) => {
      request(app).get(`/api/v1/posts/${articleId}/likes`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data[0]).to.have.property('likeid');
          
          likeId = res.body.data[0].likeid;
          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve likes if user is not an employee', (done) => {
      request(app).get(`/api/v1/posts/${articleId}/likes`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'please create an employee account to perform this task');

          if (err) return done(err);
          done();

        })
    });


    it('should show feedback if post has no like', (done) => {
      request(app).get(`/api/v1/posts/${fakeId}/likes`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'No likes yet.');
          expect(res.body.likes[0]).to.equal(undefined)

          if (err) return done(err);
          done();

        })
    });
  })

  describe('GET posts by tag', () => {
    
    it('should retrieve article of a tag', (done) => {
      request(app).get(`/api/v1/articles/tags/tech`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data[0]).to.have.property('articleid');
          expect(res.body.data[0]).to.have.property('title');
          expect(res.body.data[0]).to.have.property('articleauthorid');
          expect(res.body.data[0]).to.have.property('articlebody');

          if (err) return done(err);
          done();

        })
    });

    it('should show feedback if tag is not found', (done) => {
      request(app).get(`/api/v1/articles/tags/mushin`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'No article in this category yet.');

          if (err) return done(err);
          done();

        })
    });


    it('should not retrieve tagged article if user is not an employee', (done) => {
      request(app).get(`/api/v1/articles/tech`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'please create an employee account to perform this task');

          if (err) return done(err);
          done();

        })
    });
  })


  describe('POST flag a post', () => {
    let flaggedposttype = `article`;

    it('should flag a particular post', (done) => {
      request(app).post(`/api/v1/posts/${articleId}/flags`)
        .set('x-access-token', employeeToken)
        .send({flaggedposttype})
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data).to.have.property('message').to.equal('post flagged successfully');
          
          if (err) return done(err);
          done();

        })
    });

    it('should not flag a post which has already been flagged', (done) => {
      request(app).post(`/api/v1/posts/${articleId}/flags`)
        .set('x-access-token', employeeToken)
        .send({flaggedposttype})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('post flagged already');
          
          if (err) return done(err);
          done();

        })
    });

    it('should not flag a post if flagger is not an employee', (done) => {
      request(app).post(`/api/v1/posts/${articleId}/flags`)
        .set('x-access-token', initialAuthToken)
        .send({flaggedposttype})
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('please create an employee account to perform this task');
          
          if (err) return done(err);
          done();

        })
    });


    it('should not flag a post if flaggedposttype is wrong', (done) => {
      request(app).post(`/api/v1/posts/${articleId}/flags`)
        .set('x-access-token', employeeToken)
        .send({likedposttype: 'whatever'})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Wrong post type');
          
          if (err) return done(err);
          done();

        })
    });
    

    it('should not flag a post if flagged post id is invalid uuid', (done) => {
      request(app).post(`/api/v1/posts/123345/likes`)
        .set('x-access-token', employeeToken)
        .send({flaggedposttype})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Wrong postID');
          
          if (err) return done(err);
          done();

        })
    });

    it('should not flag a post if flagged post does not exist', (done) => {
      request(app).post(`/api/v1/posts/${fakeId}/flags`)
        .set('x-access-token', employeeToken)
        .send({flaggedposttype})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal(`${flaggedposttype} not found`);
          
          if (err) return done(err);
          done();

        })
    });

  })

  describe('GET flagged posts', () => {
    
    it('should retrieve flagged post', (done) => {
      request(app).get(`/api/v1/posts/flags`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data[0]).to.have.property('flagid');
          expect(res.body.data[0]).to.have.property('complainerid');
          expect(res.body.data[0]).to.have.property('flaggedpostid');
          expect(res.body.data[0]).to.have.property('flagstatus');
          expect(res.body.data[0]).to.have.property('flaggedposttype');

          flagId = res.body.data[0].flagid;
          if (err) return done(err);
          done();

        })
    });

    it('should not retrieve tagged article if user is not an admin', (done) => {
      request(app).get(`/api/v1/posts/flags`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          assert.equal(res.body.message, 'you need an admin account to perform this task');

          if (err) return done(err);
          done();

        })
    });
  })

  
  describe('PATCH update a flag', () => {
    let flagstatus = `resolved`;

    it('should set a pending flag as resolved', (done) => {
      request(app).patch(`/api/v1/posts/flags/${flagId}`)
        .set('x-access-token', initialAuthToken)
        .send({flagstatus})
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data).to.have.property('message').to.equal('flag updated successfully');
          
          if (err) return done(err);
          done();

        })
    });

    it('should update a flag if flagstatus is wrong', (done) => {
      request(app).patch(`/api/v1/posts/flags/${flagId}`)
        .set('x-access-token', initialAuthToken)
        .send({flagstatus: `nonsense`})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Wrong flag status');
          
          if (err) return done(err);
          done();

        })
    });

     it('should update a flag if flagger is not an admin', (done) => {
      request(app).patch(`/api/v1/posts/flags/${flagId}`)
      .set('x-access-token', employeeToken)
      .send({flagstatus})
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal(`You're not allowed to perform this task`);
          
          if (err) return done(err);
          done();

        })
    });


    it('should not flag a post if flagged post id is invalid uuid', (done) => {
      request(app).patch(`/api/v1/posts/flags/${flagId}ss`)
      .set('x-access-token', initialAuthToken)
      .send({flagstatus})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal('Wrong postID');
          
          if (err) return done(err);
          done();

        })
    });

    it('should update flag if post is not flagged', (done) => {
      request(app).patch(`/api/v1/posts/flags/${fakeId}`)
      .set('x-access-token', initialAuthToken)
      .send({flagstatus})
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body).to.have.property('message').to.equal(`Not a flagged post`);
          
          if (err) return done(err);
          done();

        })
    });

  })


  describe('POST search posts', () => {
    let searchItem = `a`
    it('should retrieve posts with search keyword', (done) => {
      request(app).post(`/api/v1/posts/search`)
        .set('x-access-token', employeeToken)
        .send({searchItem})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data).to.have.property('gifs');
          expect(res.body.data).to.have.property('comments');
          expect(res.body.data).to.have.property('articles');
          

          if (err) return done(err);
          done();

        })
    });

    it('should not search post if user is not an employee', (done) => {
      request(app).post(`/api/v1/posts/search`)
        .set('x-access-token', initialAuthToken)
        .send({searchItem})
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
          expect(res.body.message).to.equal('please create an employee account to perform this task');
         

          if (err) return done(err);
          done();

        })
    });

   
  })

  describe('DELETE a comment', () => {
    
    it('should delete a post comment if user is an employee', (done) => {
      request(app).delete(`/api/v1/posts/${articleId}/comments/${commentId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.response.deleteComment.status, 'success');
          expect(res.body.response.deleteComment).to.have.property('data').and.property('message').to.equal('comment successfully deleted');
          assert.equal(res.body.response.deleteLikes.status, 'success');
          expect(res.body.response.deleteLikes).to.have.property('data').and.property('message').to.equal('comment likes successfully deleted');
          

          if (err) return done(err);
          done();

        })
    });

    it('should delete a post comment if user is an admin', (done) => {
      request(app).delete(`/api/v1/posts/${articleId}/comments/${commentId}`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          
          assert.equal(res.body.response.deleteComment.status, 'success');
          assert.equal(res.body.response.deleteLikes.status, 'success');
          

          if (err) return done(err);
          done();

        })
    });

    
  
   
  })


describe('DELETE remove a like', () => {
    
    it('should delete an existing post likes', (done) => {
      request(app).delete(`/api/v1/posts/${articleId}/likes/${fakeId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.status, 'success');
          expect(res.body.data).to.have.property('message').to.equal('like successfully deleted');
           
          if (err) return done(err);
          done();

        })
    });

    it('should not delete post likes if user is not an employee', (done) => {
      request(app).delete(`/api/v1/posts/${articleId}/likes/${fakeId}`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
         expect(res.body).to.have.property('message').to.equal('please create an employee account to perform this task');
          
          if (err) return done(err);
          done();

        })
    });

  })

  describe('DELETE a flagged post', () => {

    it('should delete flagged post', (done) => {
      request(app).delete(`/api/v1/posts/flags/${flagId}`)
        .set('x-access-token', initialAuthToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {

          expect(res.body.response).to.have.property('deletePost').and.property('status').to.equal('success');
          expect(res.body.response).to.have.property('deletePost').and.property('data').and.property('message').to.equal('flagged post deleted successfully');
          expect(res.body.response).to.have.property('deleteLikes').and.property('status');
          expect(res.body.response).to.have.property('deleteLikes').and.property('data');
  
          if (err) return done(err);
          done();

        })
    });

    it('should not delete flagged post if user is not admin', (done) => {
      request(app).delete(`/api/v1/posts/flags/${flagId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          assert(res.body.status, `error`);
          assert(res.body.message, `You're not allowed to perform this task`);
  
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
         expect(res.body).to.have.property('message').to.equal('Sorry, could not delete article');
          
          if (err) return done(err);
          done();

        })
    });

    

   
  })

  describe('DELETE remove a gif', () => {
    
    it('should delete an existing gif', (done) => {
      request(app).delete(`/api/v1/gifs/${gifId}`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.response).to.have.property('deleteGif').and.property('status').to.equal('success');
          expect(res.body.response).to.have.property('deleteGif').and.property('data').and.property('message').to.equal('gif successfully deleted');
          expect(res.body.response).to.have.property('deleteComments').and.property('status').to.equal('success');
          expect(res.body.response).to.have.property('deleteComments').and.property('data').and.property('message').to.equal('gif comments successfully deleted');
          expect(res.body.response).to.have.property('deleteLikes').and.property('status').to.equal('success');
          expect(res.body.response).to.have.property('deleteLikes').and.property('data').and.property('message').to.equal('gif likes successfully deleted');
          
          if (err) return done(err);
          done();

        })
    });

    it('should not delete gif if id param is wrong', (done) => {
      request(app).delete(`/api/v1/gifs/12345`)
        .set('x-access-token', employeeToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          assert.equal(res.body.status, 'error');
         expect(res.body).to.have.property('message').to.equal('could not verify gif');
          
          if (err) return done(err);
          done();

        })
    });

  })


 })
