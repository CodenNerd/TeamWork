import pool from '../Models/queries';
import schema from '../Models/createArticleJoiSchema';

const deleteArticle = {
    async deleteArticle(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;

        const verifyUserQuery = `SELECT * FROM teamwork.articles WHERE articleid = $1 and articleauthorid=$2`;
        const verifyUserValues = [
            req.params.articleId,
            userId
        ]
        try {
            const { rows } = await pool.query(verifyUserQuery, verifyUserValues)
            if (!rows[0]) {
                return res.status(401).send({
                    status: `error`,
                    message: `article not found`
                })
            }
        } catch (err) {
            return res.status(400).send({
                status: `error`,
                message: `could not verify article`
            })
        }

        

        const query = `DELETE FROM teamwork.articles WHERE articleid=$1`;
        const values = [
            req.params.articleId,
        ];

        try {
            const { rows } = await pool.query(query, values);
        
            return res.status(201).send({
                status: `success`,
                data: {
                    message: 'Article successfully deleted',
                },
            });
        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: 'Sorry, our server is down.'
            });
        }
    },
};

export default deleteArticle.deleteArticle;
