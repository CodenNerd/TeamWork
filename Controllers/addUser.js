import pool from '../Models/queries';
import uuid from 'uuid/v1';

const addUser = (req, res) => {
    
    const query = `INSERT INTO teamwork.users(ID, firstName, lastName, email, password, gender, jobRole, department, address, datetime) VALUES ($1,$2, $3,$4, $5, $6, $7, $8, $9, $10)`
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
        .then(() => {
            
                return res.status(202).send({
                    status: "success",
                    data: {
                        params,
                        message: "User account successfully created",
                        token: "String",
                        userId: "Integer",
                    
                    }
                })
           
            
        })
        .catch(e => {
            console.error(e);
            return res.status(500).send({
                para: req.body,
                e,
                message:'Server error'
            });
            
        })























}

export default addUser;