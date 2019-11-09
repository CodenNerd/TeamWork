import pool from '../Models/queries';

const getPosts = {
    async getPosts(req, res) {
         // if (req.user.userType !== 'employee') return res.status(401).send({ message: 'please create an employee account to perform this task' });

        const query = `SELECT articleid as id, datetime as createdOn, title, articlebody as article, null as url, tag, null as caption, articleauthorid as authorid  FROM teamwork.articles 
        UNION 
        SELECT gifid,datetime, title,null, imageurl as url, null, caption, authorid FROM teamwork.gifs
        ORDER BY createdOn DESC`
        try {
            const { rows } = await pool.query(query);
            if (!rows[0]) {
                return res.status(404).send({
                    status: `error`,
                    message: `No post yet.`
                })
            }

            res.status(200).send({
                status: `error`,
                data: rows
            })
        } catch (error) {
            res.status(500).send({
                status: `error`,
                message: `Server error. Could not get feed`
            })
        }
    }
}
export default getPosts.getPosts;