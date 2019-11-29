# TeamWork

[![Build Status](https://travis-ci.com/CodenNerd/TeamWork.svg?branch=develop)](https://travis-ci.com/CodenNerd/TeamWork) [![Coverage Status](https://coveralls.io/repos/github/CodenNerd/TeamWork/badge.svg?branch=ch-integrate-coveralls-codeclimate-%2362)](https://coveralls.io/github/CodenNerd/TeamWork?branch=ch-integrate-coveralls-codeclimate-%2362) [![Maintainability](https://api.codeclimate.com/v1/badges/cac5614f483e81c1bea9/maintainability)](https://codeclimate.com/github/CodenNerd/TeamWork/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/cac5614f483e81c1bea9/test_coverage)](https://codeclimate.com/github/CodenNerd/TeamWork/test_coverage) ![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)

## Project Overview

TeamWork​ is an app for collaboration of employees within a company.

## Goal:

Set up the node/express server and RESTful API, then persist the data with PostgreSQL.

## What Technologies Is Needed:

- NodeJS/Express <small>Server-side programming</small>
- ESLint <small>Linting Library, Airbnb style guide</small>
- Mocha <small>Unit Testing Framework</small>
- PostgreSQL <small> Database </small>
- TravisCI <small> Continuous Integration </small>
- Coveralls <small> Coverage Status</small>
- GitHub Projects <small> Project Management Board </small>
- GitHub <small> Track changes over time in the project </small>

## Required Features of the App

1. Admin can create an employee user account.
2. Admin/Employees can sign in.
3. Employees can post gifs.
4. Employees can write and post articles.
5. Employees can edit their articles.
6. Employees can delete their articles.
7. Employees can delete their gifs post.
8. Employees can comment on other colleagues' article post.
9. Employees can comment on other colleagues' gif post.
10. Employees can view all articles and gifs, showing the most recently posted articles or gifs
first.
11. Employees can view a specific article.
12. Employees can view a specific gif post.

## Getting Started
### Prerequisites for installation
- Node js
- Express
- Git
### Installation
- Clone this repository into your local machine:
```
 git clone https://github.com/CodenNerd/TeamWork.git
 ```
- Install dependencies:
```
e.g npm install.
```
- To start the application:
```
e.g npm start
```
- Use postman to test all endpoints on port 3000.
- Test

Run Mocha test with:
```
npm run test
```

## Workable endpoints
### Base Url 
https://teamwork4andela.herokuapp.com/api/v1
 

Login response example header:
  ``` 
  headers { 
   'x-access-token', `${token}`
   }
   ```
#### Auth
- Admin Login: POST /auth/signin
  
  request example 
  ``` 
  body {
   email: 'aatanda.dammy@gmail.com',
   password: 'atanda'
  } 
  ```
  success response
  ```
  {
  "status": "success",
  "data": {
    "message": "User logged in successfully",
    "userId": UUID,
    "token": "String"
  }
}

- Create user: POST /auth/create-user

 request example 
  ``` 
  body {
	"email": "abu@gmail.com",
	"password": "abuabu",
	"firstName": "Abuu",
	"lastName": "Abu",
	"gender": "Male",
	"jobRole": "Manager",
	"department": "Finance",
	"address": "30, Odubosu close, Ikeja"
}
  ``` 
  req header 
  ```
 
     headers { 
   'x-access-token', `${token}`
   }
  }
  ```
  success response 
  ```
  {
  "message": "Succesfully Created in User",
  "status": "success",
  "data": {
    "message": "Employee account created successfully",
    "userId": UUID,
    "token": STRING
  }
}
  ```
#### Articles
- Create Article: POST /articles
  req example 
  ``` 
   body  {
      title: 'An example title',
      article:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus unde itaque mollitia, soluta sit voluptate omnis beatae placeat veniam assumenda amet voluptas, nihil eos obcaecati in iusto! Fugit, deleniti ut.',
       tag: 'health' 
    }
    headers {
    'x-access-token', `Bearer ${token}`
    }
   ```
   success
   ```
   	{
  "status": "success",
  "data": {
    "message": "Article successfully posted",
    "articleId": UUID,
    "datetime": STRING,
    "title": STRING,
    "userId": UUID
  }
}
  
- View Article by Id: GET /articles/:id

- Edit Article:  PATCH /articles/:id
- Delete Article: DELETE /articles/:id
- Comment POST /gifs/:id/comment
- Search Articles by Tags: POST /v1/search
#### Gifs
- Create Gifs: POST /gifs
- View Gif - GET /gifs/:id
- Delete Gif DELETE /gifs/:id
- Comment POST /gifs/:id/comment

#### Feed
- View all articles and gif: GET /feed



## Author
- AbdulAzeez Atanda

## License
- This project is licensed under the MIT Public License - see the LICENSE file for details


## Acknowledgement
 Heartfelt thanks to :
 - Andela
 - Facebook Developers Circle
 - The organisers of the 3-month old program
