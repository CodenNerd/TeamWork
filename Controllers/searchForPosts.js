import pool from '../Models/queries';

const getPosts = {
    async getPosts(req, res) {
        if (req.user.userType !== 'employee') return res.status(401).send({ status: `error`, message: 'please create an employee account to perform this task' });

         let {searchItem} = req.body;
         searchItem = `%${searchItem}%`;
         const searchResult = {}
         
        try {        
            const query = `SELECT * FROM teamwork.articles WHERE articlebody LIKE $1 OR title LIKE $1 ORDER BY datetime DESC`
            const { rows } = await pool.query(query, [searchItem]);
            if (!rows[0]) {
                   searchResult.articles = `No article match found.`
            }else{
                    searchResult.articles = rows
            }

        } catch (error) {
                searchResult.articles = `Server error. Could not search`
        }

        try {        
            const query = `SELECT * FROM teamwork.gifs WHERE caption LIKE $1 OR title LIKE $1 ORDER BY datetime DESC`
            const { rows } = await pool.query(query, [searchItem]);
            if (!rows[0]) {
                   searchResult.gifs = `No gif match found.`
            }else{
                    searchResult.gifs = rows
            }

        } catch (error) {
                searchResult.gifs = `Server error. Could not search`
        }

        try {        
            const query = `SELECT * FROM teamwork.comments WHERE commentbody LIKE $1 ORDER BY datetime DESC`
            const { rows } = await pool.query(query, [searchItem]);
            if (!rows[0]) {
                   searchResult.comments = `No comment match found.`
            }else{
                    searchResult.comments = rows
            }

        } catch (error) {
                searchResult.comments = `Server error. Could not search`
        }

        return res.status(200).send({
            status: `success`,
            data: searchResult
        })
    }
}
export default getPosts.getPosts;