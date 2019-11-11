import pool from '../Models/queries';
import Helper from './Helper';

const deleteFlag = {
    async delete(req, res) {
        // if (req.user.userType !== 'admin') return res.status(401).send({ message: `You're not allowed to perform this task`});

        if (!Helper.isValidUUID(req.params.flagId)) {
            return res.status(400).send({
                status: `error`,
                message: `Wrong postID`
            })
        }


        const values = [
            req.params.flagId
        ]
        try {
            const query = `SELECT * FROM teamwork.flags WHERE flagid = $1`;
            const { rows } = await pool.query(query, values);
            if (!rows[0]) {
                return res.status(500).send({
                    status: `error`,
                    message: `Flag not found`
                })
            }
            const flaggedPostID = rows[0].flaggedpostid;
            const flaggedposttype = rows[0].flaggedposttype;
            const deleteQuery = `DELETE FROM teamwork.${flaggedposttype}s WHERE ${flaggedposttype}id = $1`;
            try {

                const { rows } = await pool.query(deleteQuery, [flaggedPostID]);

                return res.status(201).send({
                    status: `success`,
                    message: `flagged post deleted successfully`,
                    rows
                })
            } catch (error) {
                return res.status(500).send({
                    status: `error`,
                    message: `Oops! Could not delete post`,
                    err
                })
            }
        }
        catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not check flag`,
                err
            })
        }
    }
};

export default deleteFlag.delete;
