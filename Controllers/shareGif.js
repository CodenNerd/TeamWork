import pool from '../Models/queries';
import uuid from 'uuid/v1';


const shareGif = {
    async share(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;

        gifIDVerificationQuery = `SELECT * from teamwork.gifs WHERE id = $1`;
        try {
            const { rows } = await pool.query(gifIDVerificationQuery, [req.params.gifId])
            if (!rows[0]) {
                return res.status(400).send({
                    status: `error`,
                    message: `gif not found`
                })
            }
        } catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not verify gif`
            })
        }

        recipientIDVerificationQuery = `SELECT * from teamwork.user WHERE id = $1`;
        try {
            const { rows } = await pool.query(recipientIDVerificationQuery, [req.params.recipientId])
            if (!rows[0]) {
                return res.status(400).send({
                    status: `error`,
                    message: `recipient not found`
                })
            }
        } catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not verify recipient`
            })
        }

        const values = [
            uuid(),
            req.params.gifId,
            userId,
            req.params.recipientId,
            new Date()
        ]
        query = `INSERT into teamwork.sharedposts (shareid, postid, authorid, recipientid, datetime) VALUES ($1, $2, $3, $4, $5)`;
        await pool.query(query, values)
    }
};

export default shareGif.share;
