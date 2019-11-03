import { Router } from 'express';


const api = Router();

api.post('/', (req, res) => {
    //Validate request object
    

    // send if successful
    res.status(202).send({
            status: "success",
            data: {
                message: "User account successfully created",
                token: String,
                userId: Integer,
            }
        })
});

export default api;
