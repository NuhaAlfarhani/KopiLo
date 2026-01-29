import 'dotenv/config';
import express from 'express';
import pgPromise from 'pg-promise';

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    try {
        const user = await db.one('SELECT * FROM users WHERE id = $1', [1]);
        res.json(user);
    } catch (error) {
        console.log('ERROR:', error);
        res.status(500).send('Error fetching user');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});