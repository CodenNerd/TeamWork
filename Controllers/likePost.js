import pool from '../Models/queries';
import uuid from 'uuid/v1';
import Helper from './Helper'

const likePost = {
    async like(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;
        let { likedposttype } = req.body
        if (!Helper.isValidUUID(req.params.postId)) {
            return res.status(400).send({
                status: `error`,
                message: `Wrong postID`
            })
        }
        if (likedposttype !== 'article' && likedposttype !== 'gif' && likedposttype !== 'comment') {
            return res.status(400).send({
                status: `error`,
                message: `Wrong post type`
            })
        }
        const checkExistingLike = `SELECT * from teamwork.likes WHERE likedpostid = $1 AND likerid=$2 AND likedposttype=$3`;
        const checkValues = [
            req.params.postId,
            userId,
            likedposttype
        ]
        try {
            const { rows } = await pool.query(checkExistingLike, checkValues)
            if (rows[0]) {
                return res.status(400).send({
                    status: `error`,
                    message: `post liked already`
                })
            }
        } catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not verify like`
            })
        }

        const values = [
            uuid(),
            userId,
            req.params.postId,
            likedposttype,
            new Date()
        ]
        try {
            const query = `INSERT into teamwork.likes(likeid, likerid, likedpostid, likedposttype, datetime) VALUES ($1, $2, $3, $4, $5) returning *`;
            const { rows } = await pool.query(query, values);
            if (!rows[0]) {
                return res.status(500).send({
                    status: `error`,
                    message: `Error liking post`
                })
            }
            return res.status(201).send({
                status: `success`,
                message: `post liked successfully`,
                rows
            })
        }
        catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not like post`,
                err
            })
        }
    }
};

export default likePost.like;
