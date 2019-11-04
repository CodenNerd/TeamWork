import pool from '../Models/queries';
import uuid from 'uuid/v1';

const addUser = (req, res) => {

    const query = `INSERT INTO teamwork.users(ID, firstName, lastName, email, password, gender, jobRole, department, address, datetime) VALUES ($1,$2, $3,$4, $5, $6, $7, $8)`
    const { firstName, lastName, email, password, gender, jobRole, department, address } = req.body;
    const params = [
        uuid(),
        firstName, 
        lastName, 
        email, 
        password, 
        gender, 
        jobRole, 
        department, 
        address,
        new Date(),
    ]
    pool.query(query, params)
        .then(response => {
            if (response) {
                return res.status(202).send({
                    status: "success",
                    data: {
                        params,
                        message: "User account successfully created",
                        token: "String",
                        userId: "Integer",
                        response,
                    }
                })
            }
            return res.status(500).send('Server error');
        })
        .catch(e => {
            console.error(e);
            res.send({
                params,
                e
            })
        })























}

export default addUser;