import pool from '../Models/queries';

const deleteLike = {
    async unlike(req, res) {
        let query;
        let values;
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
        let { userId } = req.user;

        try {
            const { rows } = await pool.query(query, values);

            return res.status(201).send({
                status: `success`,
                data: {
                    message: 'comment successfully deleted',
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

export default deleteLike.unlike;
