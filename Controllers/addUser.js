import pool from '../Models/queries';
import uuid from 'uuid/v1';
import schema from '../Models/joiSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const addUser = (req, res) => {
    if (req.user.usertype !== 'admin') return res.status(401).send({ message: 'you are not authorized to do this' });


    const { firstName, lastName, email, password, gender, jobRole, userType, department, address } = req.body;

    const validate = schema.validate({
        firstName,
        lastName,
        email,
        jobRole,
        address
    });

    if (validate.error) {
        return res.status(400).send({
            error: "validation error",
            message: validate.error.details[0].message
        })
    }

    if(gender !== "male" && gender !== "female") {
        return res.status(400).send({
            error: "validation error",
            message: "Invalid gender provided"
        })
    }
    if(userType !== "admin" && userType !== "employee"){
        return res.status(400).send({
            error: "validation error",
            message: "Invalid user type provided"
        })
    }
    
    const checkDBQuery = `SELECT * from teamwork.users WHERE email = $1`;


    pool.query(checkDBQuery, [email])
        .then(result => {
            if (result.rowCount) {
                return res.status(400).send({
                    message: `A user with email: ${email} already exists`,
                })
            }
            const query = `INSERT INTO teamwork.users(ID, firstName, lastName, email, password, gender, jobRole, usertype, department, address, datetime) VALUES ($1,$2, $3,$4, $5, $6, $7, $8, $9, $10, $11) returning *`
            let hashedPassword;
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt)
                    .then(hash => {
                        hashedPassword = hash;
                        const params = [
                            uuid(),
                            firstName,
                            lastName,
                            email,
                            hashedPassword,
                            gender,
                            jobRole,
                            userType,
                            department,
                            address,
                            new Date(),
                        ]
                        pool.query(query, params)
                            .then(({ rows }) => {

                                return res.status(202).send({
                                    status: "success",
                                    data: {
                                        message: "User account successfully created",
                                        token: jwt.sign({
                                            userId: rows[0].id
                                        }, process.env.SECRET, { expiresIn: '7d' }),
                                        userId: params[0],
                                        params
                                    }
                                })


                            })
                            .catch(e => {
                                console.error(e);
                                return res.status(500).send({
                                    reqBody: req.body,
                                    e,
                                    message: 'Oops, our server is down'
                                });

                            })




                    }).catch(e => {
                        return res.status(500).send({
                            message: `could not hash password`,
                            e
                        })
                    })
            })

        })
        .catch(e => {
            return res.status(500).send({
                e
            })
            console.error(e);
        })

}

export default addUser;