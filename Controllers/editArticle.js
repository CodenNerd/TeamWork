import pool from '../Models/queries';
import schema from '../Models/createArticleJoiSchema';
import uuid from 'uuid/v1';
import { verify } from 'crypto';


const editArticle = {
    async editArticle(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;

        // verify that article is edited by its author

        verifyUserQuery = `SELECT * FROM teamwork.articles WHERE articleid = $1 and authorid=$2`;
        verifyUserValues = [
            req.params.articleId,
            userId
        ]
        try {
            const { rows } = await pool.query(verifyUserQuery, verifyUserValues)
            if (!rows[0]) {
                return res.status(401).send({
                    status: `error`,
                    message: `you are not allowed to edit this article`
                })
            }
        } catch (err) {
            return res.status(400).send({
                status: `error`,
                message: `could not verify article`
            })
        }

        let { title, content, tag } = req.body;

        if (!title) {
            return res.status(400).send({
                status: `error`,
                message: `title must be provided`
            })
        }
        if (!content) {
            return res.status(400).send({
                status: `error`,
                message: `content must be provided`
            })
        }
        if (!tag) {
            return res.status(400).send({
                status: `error`,
                message: `tag must be provided`
            })
        }
        const validate = schema.validate({
            title,
            content,
            tag
        })

        if (validate.error) {
            return res.status(400).send({
                status: `error`,
                message: validate.error.details[0].message
            })
        }
        title = title.trim();
        content = content.trim();
        tag = tag.trim();

        const query = `UPDATE teamwork.articles SET title=$1, content=$2, tag=$3 WHERE articleid = $4 returning *`;
        const values = [
            title,
            content,
            tag,
            req.params.articleId,
        ];

        try {
            const { rows } = await pool.query(query, values);
            if (!rows[0]) {
                return res.status(500).send({
                    status: `error`,
                    message: 'error posting article'
                });
            }
            return res.status(201).send({
                status: `success`,
                data: {
                    articleId: rows[0].articleid,
                    message: 'Article updated successfully',
                    createdOn: rows[0].datetime,
                    title: rows[0].title,
                    tag: rows[0].tag,
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

export default editArticle.editArticle;
