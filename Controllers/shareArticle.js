import pool from '../Models/queries';
import uuid from 'uuid/v1';
import Helper from './Helper'

const shareArticle = {
    async share(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;

        if (!Helper.isValidUUID(req.params.articleId) || !Helper.isValidUUID(req.params.recipientId)) {
            return res.status(400).send({
                status: `error`,
                message: `Wrong article ID or recipient ID`
            })
        }
        const articleIDVerificationQuery = `SELECT * from teamwork.articles WHERE articleid = $1`;
        try {
            const { rows } = await pool.query(articleIDVerificationQuery, [req.params.articleId])
            if (!rows[0]) {
                return res.status(400).send({
                    status: `error`,
                    message: `article not found`
                })
            }
        } catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not verify article`
            })
        }

        const recipientIDVerificationQuery = `SELECT * from teamwork.users WHERE id = $1`;
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
            req.params.articleId,
            userId,
            req.params.recipientId,
            new Date()
        ]
        console.log(values);
        try {
            const query = `INSERT into teamwork.sharedposts(shareid, postid, authorid, recipientID, datetime) VALUES ($1, $2, $3, $4, $5) returning *`;
            const { rows } = await pool.query(query, values);
            if (!rows[0]) {
                return res.status(500).send({
                    status: `error`,
                    message: `Error sharing post`
                })
            }
            return res.status(201).send({
                status: `success`,
                message: `article shared successfully`
            })
        }
        catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not share post`,
                err
            })
        }
    }
};

export default shareArticle.share;
