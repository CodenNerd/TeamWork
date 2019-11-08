import pool from '../Models/queries';

const deletegif = {
    async deletegif(req, res) {
        // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });
        let { userId } = req.user;

        const verifyUserQuery = `SELECT * FROM teamwork.gifs WHERE gifid = $1 and authorid=$2`;
        const verifyUserValues = [
            req.params.gifId,
            userId
        ]
        try {
            const { rows } = await pool.query(verifyUserQuery, verifyUserValues)
            if (!rows[0]) {
                return res.status(401).send({
                    status: `error`,
                    message: `gif not found`
                })
            }
        } catch (err) {
            return res.status(400).send({
                status: `error`,
                message: `could not verify gif`
            })
        }

        

        const query = `DELETE FROM teamwork.gifs WHERE gifid=$1`;
        const values = [
            req.params.gifId,
        ];

        try {
            const { rows } = await pool.query(query, values);
        
            return res.status(201).send({
                status: `success`,
                data: {
                    message: 'gif successfully deleted',
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

export default deletegif.deletegif;
