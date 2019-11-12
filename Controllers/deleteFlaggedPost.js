import pool from '../Models/queries';
import Helper from './Helper';

const deleteFlag = {
    async delete(req, res) {
        // if (req.user.userType !== 'admin') return res.status(401).send({ message: `You're not allowed to perform this task`});
        let response
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

                response.deletePost = {
                    status: `success`,
                    message: `flagged post deleted successfully`,
                    rows
                }
            } catch (error) {
                return res.status(500).send({
                    status: `error`,
                    message: `Oops! Could not delete post`,

                })
            }
        }
        catch (err) {
            return res.status(500).send({
                status: `error`,
                message: `Oops! Could not check flag`,
                
            })
        }

        try {
            const query = `DELETE FROM teamwork.likes WHERE likedpostid=$1 AND likedposttype=$2`;
            const values = [
                req.params.gifId,
                flaggedposttype
            ];
            const { rows } = await pool.query(query, values);

            response.deleteLikes = {
                status: `success`,
                data: {
                    message: 'post likes successfully deleted',
                },
            };
        } catch (error) {
            response.deleteLikes = {
                status: `error`,
                data: {
                    message: 'post likes delete error',
                },
            };
        }

        return res.status(200).send({
            response
        })
    }
};

export default deleteFlag.delete;
