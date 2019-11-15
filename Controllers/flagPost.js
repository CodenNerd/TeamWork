import pool from '../Models/queries';
import uuid from 'uuid/v1';
import Helper from './Helper'

const flagPost = {
    async flag(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ status: `error`, message: 'please create an employee account to perform this task' });
        
        let { userId } = req.user;
        let { flaggedposttype } = req.body;
        let dateTime;
        if (!Helper.isValidUUID(req.params.postId)) {
            return res.status(400).send({
                status: `error`,
                message: `Wrong postID`
            })
        }
        if (flaggedposttype !== 'article' && flaggedposttype !== 'gif' && flaggedposttype !== 'comment') {
            return res.status(400).send({
                status: `error`,
                message: `Wrong post type`
            })
        }
        const targetTable = flaggedposttype+'s';
        const targetIdColumn = flaggedposttype+'id';
        const postIDVerificationQuery = `SELECT * from teamwork.${targetTable} WHERE ${targetIdColumn} = $1`;
        try {
            const { rows } = await pool.query(postIDVerificationQuery, [req.params.postId])
            if (!rows[0]) {
                return res.status(400).send({
                    status: `error`,
                    message: `${flaggedposttype} not found`
                })
            }
            dateTime = rows[0].datetime;
        } catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not verify ${flaggedposttype}`
            })
        }


        const checkExistingFlag = `SELECT * from teamwork.flags WHERE flaggedpostid = $1 AND flaggedposttype=$2`;
        const checkValues = [
            req.params.postId,
            flaggedposttype
        ]
        try {
            const { rows } = await pool.query(checkExistingFlag, checkValues)
            if (rows[0]) {
                return res.status(400).send({
                    status: `error`,
                    message: `post flagged already`
                })
            }
        } catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not verify flag`
            })
        }

        const values = [
            uuid(),
            userId,
            req.params.postId,
            flaggedposttype,
            'pending',
            dateTime
        ]
        try {
            const query = `INSERT into teamwork.flags(flagid, complainerid, flaggedpostid, flaggedposttype, flagstatus, postdatetime) VALUES ($1, $2, $3, $4, $5, $6) returning *`;
            const { rows } = await pool.query(query, values);
            if (!rows[0]) {
                return res.status(500).send({
                    status: `error`,
                    message: `Error flagging post`
                })
            }
            return res.status(201).send({
                status: `success`,
                data:{
                message: `post flagged successfully`,
                },
                rows
            })
        }
        catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not flag post`,
                err
            })
        }
    }
};

export default flagPost.flag;
