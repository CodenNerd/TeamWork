import pool from '../Models/queries';

const getFlags = {
    async getFlags(req, res) {
        if (req.user.userType !== 'admin') return res.status(401).send({ status: `error`, message: 'you need an admin account to perform this task' });

        const query = `SELECT * FROM teamwork.flags WHERE flagstatus='pending'`
        try {
            const { rows } = await pool.query(query);
            if (!rows[0]) {
                return res.status(404).send({
                    status: `error`,
                    message: `No flags yet.`,
                    flags:[]
                })
            }

            return res.status(200).send({
                status: `success`,
                data: rows
            })
        } catch (error) {
            return res.status(500).send({
                status: `error`,
                message: `Server error. Could not get flags`
            })
        }
    }
}
export default getFlags.getFlags;