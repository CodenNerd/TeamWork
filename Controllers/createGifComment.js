import pool from '../Models/queries';
import schema from '../Models/createCommentJoiSchema';
import uuid from 'uuid/v1';
import Helper from './Helper';


const createComment = {
    async newComment(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ status: `error`, message: 'please create an employee account to perform this task' });
        
        let { userId } = req.user;
        let { commentBody } = req.body;
        let gifTitle;
        const commentPostID = req.params.gifId;
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
        const selectQuery = `SELECT title FROM teamwork.gifs WHERE gifID = $1`

          try {
        const { rows } = await pool.query(selectQuery, selectValues);
        if (!rows[0]) {
            return res.status(500).send({
                status: `error`,
                message: 'gif not found'
            });
        }

        gifTitle = rows[0].title;
        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: 'Sorry, could not find gif'
            });
        }


        const query = `INSERT INTO teamwork.comments(commentid, commentbody,  commentauthorid, commentpostid, commentposttype, datetime) VALUES($1, $2, $3, $4, $5, $6) returning *`;
        const values = [
            uuid(),
            commentBody,
            userId,
            commentPostID,
            'gif',
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
                    gifTitle,
                    createdOn: rows[0].datetime,
                    commentBody: rows[0].commentBody  
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
