import pool from '../Models/queries';
import schema from '../Models/createCommentJoiSchema';
import uuid from 'uuid/v1';
import Helper from './Helper';


const createComment = {
    async newComment(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;
        let { commentBody, commentPostID, commentAuthorID, commentPostType } = req.body;

       if(!Helper.isValidUUID(commentAuthorID)|| !Helper.isValidUUID(commentPostID)){
           return res.status(400).send({
               status: `error`,
               message: `invalid credentials provided`
           })
       }
    
        const validate = schema.validate({
            commentBody, 
        })

        if(validate.error){
            return res.status(400).send({
                status: `error`,
                message: validate.error.details[0].message
            })
        }
        commentBody = commentBody.trim();
        

        const query = `INSERT INTO teamwork.comments(commentid, commentbody,  commentauthorid, commentpostid, datetime) VALUES($1, $2, $3, $4, $5, $6) returning *`;
        const values = [
            uuid(),
            commentBody,
            userId,
            commentPostID,
            new Date(),
        ];

        try {
            const { rows } = await pool.query(query, values);
            if(!rows[0]){
                return res.status(500).send({
                    status: `error`,
                    message: 'error posting comment'
                });
            }
            return res.status(201).send({
                status: `success`,
                data: {
                    commentId: rows[0].commentid,
                    message: 'comment posted successfully',
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

export default createComment.newComment;
