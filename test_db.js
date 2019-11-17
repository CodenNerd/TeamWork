const { Pool } = require('pg');
const dotenv = require('dotenv');
const uuid = require('uuid/v1');
import Helper from './Controllers/Helper';

dotenv.config();


const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.test_db,

    password: process.env.PASSWORD,
    port: process.env.dbPORT,
});
console.log(process.env.test_db, '+++---+++')

pool.on('connect', () => {
    console.log('connected to db.................');
});


const createSchema = () => {
    const queryText = `CREATE SCHEMA teamwork`;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
            console.log('schema çreated');
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}

const dropSchema = () => {
    const queryText = `DROP SCHEMA teamwork CASCADE`;
    pool.query(queryText)
        .then((res) => {
            console.log('schema dropped', res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};





//..............................................//


const createAllTables = () => {

        // createUsersTable();
        // createCommentsTable();
        // createArticlesTable();
        // createGifsTable();
        // createFlagsTable();
        // createLikesTable();
        // createSharesTable();


        const queryText = `CREATE TABLE teamwork.users
    (
        id uuid NOT NULL,
        firstname character varying(30),
        lastname character varying(30),
        email character varying(35),
        password character varying(150),
        gender character varying(6),
        jobrole character varying(25),
        department character varying(15),
        address character varying(100),
        datetime timestamptz,
        usertype character varying(8),
        CONSTRAINT users_pkey PRIMARY KEY (id)
    ); 
    
    CREATE TABLE teamwork.comments
    (
        commentid uuid NOT NULL,
        commentbody character varying(250),
        commentpostid character varying(100) NOT NULL,
        commentauthorid character varying(100),
        datetime timestamptz,
        commentposttype character varying(7) NOT NULL,
        CONSTRAINT comments_pkey PRIMARY KEY (commentid)
    );
    
    CREATE TABLE teamwork.articles
    (
        articleid uuid NOT NULL,
        articlebody character varying(2000),
        articleauthorid character varying(100),
        tag character varying(20),
        datetime timestamptz,
        title character varying(50) NOT NULL,
        CONSTRAINT articles_pkey PRIMARY KEY (articleid)
    );

    CREATE TABLE teamwork.gifs
    (
        gifid uuid NOT NULL,
        imageurl character varying(150),
        title character varying(50),
        caption character varying(50),
        authorid character varying(100),
        datetime timestamptz,
        CONSTRAINT gifs_pkey PRIMARY KEY (gifid)
    );

    CREATE TABLE teamwork.flags
    (
        flagid uuid NOT NULL,
        complainerid uuid,
        flaggedpostid uuid NOT NULL,
        flaggedposttype character varying(7) NOT NULL,
        flagstatus character varying(10) NOT NULL,
        postdatetime timestamptz NOT NULL,
        CONSTRAINT flags_pkey PRIMARY KEY (flagid)
    );

    CREATE TABLE teamwork.likes
(
    likeid uuid NOT NULL PRIMARY KEY,
    likerid uuid NOT NULL,
    likedpostid uuid NOT NULL,
    likedposttype character varying(12) NOT NULL,
    datetime timestamptz NOT NULL
    
);

CREATE TABLE teamwork.sharedposts
    (
        shareid uuid NOT NULL,
        postid uuid NOT NULL,
        authorid uuid NOT NULL,
        recipientid uuid NOT NULL,
        datetime timestamptz NOT NULL,
        CONSTRAINT "sharedPosts_pkey" PRIMARY KEY (shareid)
    );

    `;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
            console.log('tables çreated');
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};


const createAdmin = () => {
    const id = uuid();
    const password = Helper.hashPassword('atanda');
    const queryText = `INSERT INTO teamwork.users(id, firstname, lastname, email, password, gender, jobrole, usertype, department, address, datetime) VALUES ($1,'AbdulAzeez', 'Atanda', 'aatanda.dammy@gmail.com', $2, 'male', 'HR manager', 'admin', 'HR', 'Ojota, Lagos', '2019-11-15 06:06:03.856+00') returning *;`;

    pool.query(queryText, [id, password])
        .then((res) => {
            console.log(res);
            console.log('admin created');
            pool.end();
        })
        .catch((err) => {
            console.log(err, '====');
            pool.end();
        });
}


const dropAllTables = () => {
    dropSchema();
};
pool.on('remove', () => {
    console.log('connection ended...');
    process.exit(0);
});

module.exports = {
    createAllTables,
    dropAllTables,
    createSchema,
    createAdmin
};

require('make-runnable');
