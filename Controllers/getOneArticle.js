import pool from '../Models/queries';

const getPost = {
    async getPost(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ status: `error`, message: 'please create an employee account to perform this task' });

        const query = `SELECT * FROM teamwork.articles  WHERE articleid = $1`
        try {
            const { rows } = await pool.query(query, [req.params.articleId]);
            if (!rows[0]) {
                return res.status(404).send({
                    status: `error`,
                    message: `Article not found`
                })
            }
            let comments;
            try {
                const commentQuery = `SELECT commentId, commentBody, commentAuthorId FROM teamwork.comments WHERE commentpostid=$1 AND commentposttype='article'`
                const { rows } = await pool.query(commentQuery, [req.params.articleId]);
                if (rows[0]) {
                    comments = rows
                }else{
                    comments = []
                }


            } catch (error) {
                return res.status(500).send({
                    status: `error`,
                    message: `Server error. Could not get comments`
                })
            }

            let postLikes;
            try {
                const likeQuery = `SELECT * FROM teamwork.likes WHERE likedpostid=$1 AND likedposttype='article'`;
                const { rows } = await pool.query(likeQuery, [req.params.articleId]);
                if (rows[0]) {
                    postLikes = rows
                }else{
                    postLikes = []
                }


            } catch (error) {
                return res.status(500).send({
                    status: `error`,
                    message: `Server error. Could not get likes`
                })
            }

            return res.status(200).send({
                status: `success`,
                data: {
                    id: rows[0].articleid,
                    createdOn: rows[0].datetime,
                    title: rows[0].title,
                    article: rows[0].articlebody,
                    comments,
                    likes:postLikes
                    }
                })
        } catch (error) {
            res.status(500).send({
                status: `error`,
                message: `Server error. Could not get article`
            })
        }
    }
}
export default getPost.getPost;