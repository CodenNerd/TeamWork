import pool from '../Models/queries';

const deleteLike = {
    async unlike(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;

        

        const query = `DELETE FROM teamwork.likes WHERE likeid = $1 AND likerid=$2 AND likedpostid=$3`;
        const values = [
            req.params.likeId,
            userId,
            req.params.postId
        ];

        try {
            const { rows } = await pool.query(query, values);
        
            return res.status(201).send({
                status: `success`,
                data: {
                    message: 'like successfully deleted',
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
