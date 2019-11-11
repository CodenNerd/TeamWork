import pool from '../Models/queries';

const getLikes = {
    async getLikes(req, res) {
         // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });

        const query = `SELECT * FROM teamwork.likes WHERE likedpostid=$1`
        try {
            const { rows } = await pool.query(query, [req.params.postId]);
            if (!rows[0]) {
                return res.status(404).send({
                    status: `error`,
                    message: `No likes yet.`,
                    likes:[]
                })
            }

            return res.status(200).send({
                status: `success`,
                data: rows
            })
        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: `Server error. Could not get likes`
            })
        }
    }
}
export default getLikes.getLikes;