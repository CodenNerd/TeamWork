import pool from '../Models/queries';
import cloudinary from 'cloudinary';

const deletegif = {
    async deletegif(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ status: `error`, message: 'please create an employee account to perform this task' });

        let { userId } = req.user;
        let response = {};
        let imageURL;
        let img_public_id;
        const verifyQuery = `SELECT * FROM teamwork.gifs WHERE gifid = $1 and authorid=$2`;
        const verifyValues = [
            req.params.gifId,
            userId
        ]
        try {
            const { rows } = await pool.query(verifyQuery, verifyValues)
            if (!rows[0]) {
                return res.status(401).send({
                    status: `error`,
                    message: `gif not found`
                })
            }

            imageURL = rows[0].imageurl;
            imageURL = imageURL.split('--');
            img_public_id = imageURL[1]; 
        } catch (err) {
            return res.status(400).send({
                status: `error`,
                message: `could not verify gif`
            })
        }



        const query = `DELETE FROM teamwork.gifs WHERE gifid=$1`;
        const values = [
            req.params.gifId,
        ];


        try {
            const { rows } = await pool.query(query, values);
            
            response.deleteGif = {
                status: `success`,
                data: {
                    message: 'gif successfully deleted',
                },
            };
            await cloudinary.uploader.destroy(img_public_id, (result) => { 
                 response.deleteGif.data.cmessage = 'gif successfully deleted on cloudinary';
            });

        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: 'Sorry, our server is down.'
            });
        }
        try {
            const query = `DELETE FROM teamwork.comments WHERE commentpostid=$1 AND commentposttype=$2`;
            const values = [
                req.params.gifId,
                'gif'
            ];
            const { rows } = await pool.query(query, values);

            response.deleteComments = {
                status: `success`,
                data: {
                    message: 'gif comments successfully deleted',
                },
            };
        } catch (error) {
            response.deleteComments = {
                status: `error`,
                data: {
                    message: 'gif comments delete error',
                },
            };
        }

        try {
            const query = `DELETE FROM teamwork.likes WHERE likedpostid=$1 AND likedposttype=$2`;
            const values = [
                req.params.gifId,
                'gif'
            ];
            const { rows } = await pool.query(query, values);

            response.deleteLikes = {
                status: `success`,
                data: {
                    message: 'gif likes successfully deleted',
                },
            };
        } catch (error) {
            response.deleteLikes = {
                status: `error`,
                data: {
                    message: 'gif likes delete error',
                },
            };
        }
        return res.status(200).send({
            response,
           
        })
    },
};

export default deletegif.deletegif;
