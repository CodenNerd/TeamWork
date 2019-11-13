import pool from '../Models/queries';

const getPosts = {
    async getPosts(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ status: `error`, message: 'please create an employee account to perform this task' });

        const query = `SELECT * FROM teamwork.articles WHERE tag = $1`
        try {
            const { rows } = await pool.query(query, [req.params.tag]);
            if (!rows[0]) {
                return res.status(404).send({
                    status: `error`,
                    message: `No article in this category yet.`
                })
            }

            return res.status(200).send({
                status: `success`,
                data: rows
            })
        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: `Server error. Could not get article`
            })
        }
    }
}
export default getPosts.getPosts;