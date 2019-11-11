import pool from '../Models/queries';
import uuid from 'uuid/v1';
import Helper from './Helper'

const flagPost = {
    async flag(req, res) {
        // if (req.user.userType !== 'admin') return res.status(401).send({ message: `You're not allowed to perform this task`});
        let { flagstatus } = req.body;

        if (!Helper.isValidUUID(req.params.flagId)) {
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
                    message: `Not a flagged post`
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
