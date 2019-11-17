import pool from '../Models/queries';

const deleteComment = {
    async delete(req, res) {
        let query;
        let values;        
        let { userId } = req.user;
        let response = {};

        if (req.user.userType === 'employee') {
            query = `DELETE FROM teamwork.comments WHERE commentid = $1 AND commentauthorid=$2`;
            values = [
                req.params.commentId,
                userId,
            ];
        }
        else if (req.user.userType === 'admin') {
            query = `DELETE FROM teamwork.comments WHERE commentid = $1`;
            values = [
                req.params.commentId
            ]

        }
        else{
            return res.status(401).send({
                status: `error`,
                message: `You're not authorized to perform this task`
            })
        }

        try {
            const { rows } = await pool.query(query, values);

            response.deleteComment = {
                status: `success`,
                data: {
                    message: 'comment successfully deleted',
                },
            };
        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: 'Sorry, our server is down.',
                
            });
        }

        try {
            const query = `DELETE FROM teamwork.likes WHERE likedpostid=$1 AND likedposttype=$2`;
            const values = [
                req.params.gifId,
                'comment'
            ];
            const { rows } = await pool.query(query, values);

            response.deleteLikes = {
                status: `success`,
                data: {
                    message: 'comment likes successfully deleted',
                },
            };
        } catch (error) {
            response.deleteLikes = {
                status: `error`,
                data: {
                    message: 'comment likes delete error',
                },
            };
        }

        return res.status(200).send({
            response
        })
    },
};

export default deleteComment.delete;
