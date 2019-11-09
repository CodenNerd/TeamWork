import pool from '../Models/queries';

const getPost = {
    async getPost(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });

        const query = `SELECT * FROM teamwork.gifs  WHERE gifid = $1`
        try {
            const { rows } = await pool.query(query, [req.params.gifId]);
            if (!rows[0]) {
                return res.status(404).send({
                    status: `error`,
                    message: `Gif not found.`
                })
            }
            let comments;
            try {
                const commentQuery = `SELECT commentId, commentBody, commentAuthorId FROM teamwork.comments WHERE commentpostid=$1 AND commentposttype='gif'`
                const { rows } = await pool.query(commentQuery, [req.params.gifId]);
                if (rows[0]) {
                    comments = rows
                }else{
                    comments = []
                }


            } catch (error) {
                res.status(500).send({
                    status: `error`,
                    message: `Server error. Could not get comments`
                })
            }
            return res.status(200).send({
                status: `success`,
                data: {
                    id: rows[0].gifid,
                    createdOn: rows[0].datetime,
                    title: rows[0].title,
                    url: rows[0].imageurl,
                    comments
                    }
                })
        } catch (error) {
            res.status(500).send({
                status: `error`,
                message: `Server error. Could not get gif`
            })
        }
    }
}
export default getPost.getPost;