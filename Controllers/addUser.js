import pool from '../Models/queries';
import uuid from 'uuid/v1';
import schema from '../Models/joiSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Helper from './Helper';

dotenv.config();

const addUser = (req, res) => {
    if (req.user.userType !== 'admin') return res.status(401).send({ message: 'you are not authorized to do this' });


    let { firstName, lastName, email, password, gender, jobRole, userType, department, address } = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    gender = gender.trim();
    jobRole = jobRole.trim();
    userType = userType.trim();
    department = department.trim();
    address = address.trim();
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

    if (gender !== "male" && gender !== "female") {
        return res.status(400).send({
            error: "validation error",
            message: "Invalid gender provided"
        })
    }
    if (userType !== "admin" && userType !== "employee") {
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
                    status:`error`,
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
                                        token: Helper.generateToken(rows[0].id),
                                    }
                                })


                            })
                            .catch(e => {
                                console.error(e);
                                return res.status(500).send({
                                    status: `error`,
                                    message: 'Oops, our server is down'
                                });

                            })




                    }).catch(e => {
                        return res.status(500).send({
                            status:`error`,
                            message: `could not hash password`,
                        })
                    })
            })

        })
        .catch(e => {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Our server is down`
            })
        })

}

export default addUser;