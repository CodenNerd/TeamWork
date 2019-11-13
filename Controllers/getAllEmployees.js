import pool from '../Models/queries';

const getEmployees = {
    async getEmployees(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ status: `error`, message: 'please create an employee account to perform this task' });

        const query = `SELECT id, firstname, lastname, email, gender, jobrole, department, address, datetime FROM teamwork.users WHERE usertype=$1`
        try {
            const { rows } = await pool.query(query, ['employee']);
            if (!rows[0]) {
                return res.status(404).send({
                    status: `error`,
                    message: `No users yet.`
                })
            }

            res.status(200).send({
                status: `error`,
                data: rows
            })
        } catch (error) {
            res.status(500).send({
                status: `error`,
                message: `Server error. Could not get users`
            })
        }
    }
}
export default getEmployees.getEmployees;