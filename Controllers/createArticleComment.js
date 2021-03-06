import pool from '../Models/queries';
import schema from '../Models/createCommentJoiSchema';
import uuid from 'uuid/v1';
import Helper from './Helper';


const createComment = {
    async newComment(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ status: `error`, message: 'please create an employee account to perform this task' });
      
        let { userId } = req.user;
        let { commentBody } = req.body;
        let articleBody;
        let articleTitle;
        const commentPostID = req.params.articleId;
        if (!Helper.isValidUUID(commentPostID)) {
            return res.status(400).send({
                status: `error`,
                message: `invalid credentials provided`
            })
        }

        const validate = schema.validate({
            commentBody,
        })

        if (validate.error) {
            return res.status(400).send({
                status: `error`,
                message: validate.error.details[0].message
            })
        }
        commentBody = commentBody.trim();

        const selectValues = [
            commentPostID
        ]
        const selectQuery = `SELECT articlebody, title FROM teamwork.articles WHERE articleID = $1`

          try {
        const { rows } = await pool.query(selectQuery, selectValues);
        if (!rows[0]) {
            return res.status(400).send({
                status: `error`,
                message: 'article not found'
            });
        }

        articleBody = rows[0].articlebody;
        articleTitle = rows[0].title;
        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: 'Sorry, could not find article'
            });
        }


        const query = `INSERT INTO teamwork.comments(commentid, commentbody,  commentauthorid, commentpostid, commentposttype, datetime) VALUES($1, $2, $3, $4, $5, $6) returning *`;
        const values = [
            uuid(),
            commentBody,
            userId,
            commentPostID,
            'article',
            new Date(),
        ];

        try {
            const { rows } = await pool.query(query, values);
            if (!rows[0]) {
                return res.status(500).send({
                    status: `error`,
                    message: 'error posting comment'
                });
            }

            return res.status(201).send({
                status: `success`,
                data: {
                    message: 'comment posted successfully',
                    articleTitle,
                    article: articleBody,
                    createdOn: rows[0].datetime,
                    commentBody: rows[0] 
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

export default createComment.newComment;
