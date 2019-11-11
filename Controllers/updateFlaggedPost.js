import pool from '../Models/queries';
import uuid from 'uuid/v1';
import Helper from './Helper'

const flagPost = {
    async flag(req, res) {
        // if (req.user.userType !== 'admin') return res.status(401).send({ message: `You're not allowed to perform this task`});
        let { flaggedposttype, flagstatus } = req.body;

        if (!Helper.isValidUUID(req.params.postId)) {
            return res.status(400).send({
                status: `error`,
                message: `Wrong postID`
            })
        }
        if(flagstatus!=='resolved' && flagstatus!=='pending'){
            return res.status(400).send({
                status: `error`,
                message: `Wrong flag status`
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
            if (!rows[0]) {
                return res.status(400).send({
                    status: `error`,
                    message: `Not a flagged post`
                })
            }
        } catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not verify flag`
            })
        }

        const values = [
            flagstatus,
            req.params.flagId
        ]
        try {
            const query = `UPDATE teamwork.flags SET flagstatus=$1 WHERE flagid = $2 returning *`;
            const { rows } = await pool.query(query, values);
            if (!rows[0]) {
                return res.status(500).send({
                    status: `error`,
                    message: `Error flagging post`
                })
            }
            return res.status(201).send({
                status: `success`,
                message: `flag updated successfully`,
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
