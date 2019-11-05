import pool from '../Models/queries';
import uuid from 'uuid/v1';
import schema from '../Models/joiSchema';

const addUser = (req, res) => {
    const { firstName, lastName, email, password, gender, jobRole, department, address } = req.body;
    
   const validate  = schema.validate({
        firstName,
        lastName,
        email,
        address
    });
    
    if(validate.error){
        return res.status(400).send({
            error: "validation error",
            message: validate.error.details[0].message
        })
    }

     const checkDBQuery = `SELECT * from teamwork.users WHERE email = $1`;


     pool.query(checkDBQuery, [email])
    .then(result =>{
        if(result.rowCount){
            return res.status(400).send({
                message: `A user with email:${email} already exists`,
                result
            })
        }
        const query = `INSERT INTO teamwork.users(ID, firstName, lastName, email, password, gender, jobRole, department, address, datetime) VALUES ($1,$2, $3,$4, $5, $6, $7, $8, $9, $10)`
    
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
                        message: "User account successfully created",
                        token: "String",
                        userId: params[0],
                    
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
    })
     .catch(e=>{
         return res.status(500).send({
             e
         })
        console.error(e);
     })

   

    

}

export default addUser;