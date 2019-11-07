import pool from '../Models/queries';
import schema from '../Models/createGifJoiSchema';
import uuid from 'uuid/v1';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: `codennerd`,
    api_key: 141424747197212,
    api_secret: '9yRV3eKHg0dW74gUUpq9RFNFBL8'

})
const createGif = {
    async newGif(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;
        let { title, caption } = req.body;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const { image } = req.files;

        if (image.mimetype !== `image/gif`) {
            return res.status(400).send({
                status: `error`,
                message: `Selected image must be GIF`
            })
        }
        if (image.size > 20 * 1024 * 1024) return res.status(400).send({ status: `error`, message: `file size should not exceed 20mb` })

        if (!title) {
            res.status(400).send({
                status: `error`,
                message: `You need to provide a title`
            })
        }
        let imageURL;
        await cloudinary.uploader.upload(image.tempFilePath, (err, result) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: `Error uploading image`
                })
            }
            imageURL = result.secure_url;
        })

        title = title.trim();
        caption = caption.trim();

        const validate = schema.validate({
            title,
            caption
        })

        if (validate.error) {
            return res.status(400).send({
                status: `error`,
                message: validate.error.details[0].message
            })
        }

        const query = `INSERT INTO teamwork.gifs(gifID, imageURL, title, caption, authorID, datetime) VALUES($1, $2, $3, $4, $5, $6) returning *`;
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
                status: `success`,
                data: {
                    gifId: rows[0].gifid,
                    message: 'Gif uploaded successfully',
                    createdOn: rows[0].datetime,
                    title: rows[0].title,
                    imageURL: rows[0].imageurl
                },
            });
        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: 'Sorry, our server is down.'
            });
        }
    },
};

export default createGif.newGif;
