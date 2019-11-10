import pool from '../Models/queries';

const getOneEmployee = {
    async getOneEmployee(req, res) {
         // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });

        const query = `SELECT id, firstname, lastname, email, gender, jobrole, department, address, datetime FROM teamwork.users WHERE id=$1 AND usertype=$2`
        try {
            const { rows } = await pool.query(query, [req.params.employeeId, 'employee']);
            if (!rows[0]) {
                return res.status(404).send({
                    status: `error`,
                    message: `Employee not found.`
                })
            }

            res.status(200).send({
                status: `error`,
                data: rows[0]
            })
        } catch (error) {
            res.status(500).send({
                status: `error`,
                message: `Server error. Could not get employee`
            })
        }
    }
}
export default getOneEmployee.getOneEmployee;