import pool from 'pg';
import schema from '../Models/createGifJoiSchema';
import uuid from 'uuid/v1'
const createGif = {
    async newGif(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;
        let { image, title, caption } = req.body;

        // multer ft cloudinary
        title = title.trim();
        caption = caption.trim();

        const validate = schema.validate({
            title,
            caption
        })

        if (validate.error) {
            res.status(400).send({
                status: `error`,
                message: validate.error.details[0].message
            })
        }
        
        const query = `INSERT INTO
        teamwork.gifs(gifID, imageURL, title, caption, authorID, datetime)
        VALUES($1, $2, $3, $4, $5, $6)
        returning *`;
        const values = [
            uuid(),
            imageURL,
            title,
            caption,
            userId,
            new Date(),
        ];

        try {
            const { rows } = await pool.query(query, values);
            return res.status(201).send({
                status: success,
                data: {
                   gifId: rows[0].gifID,
                   message: 'The menu has been created',
                   createdOn: rows[0].datetime,
                   title: rows[0].ID,
                   imageURL: rows[0].imageURL
                }
                ,
            });
        } catch (error) {  
            return res.status(500).send({ error: 'Sorry, our server is down.' });
        }
    },
};

export default createGif.newGif;
