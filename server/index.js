require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


const createTables = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(50) NOT NULL UNIQUE,
            first_name VARCHAR(50) NOT NULL UNIQUE,
            last_name VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            filename TEXT,
            result TEXT,
            date TEXT,
            time TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);
};
createTables();


app.post('/signup', async (req, res) => {
    const { email,firstName,lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.query('INSERT INTO users (email,first_name,last_name, password_hash) VALUES (?,?,?,?)', [email,firstName,lastName, hashedPassword]);
        res.status(201).send({ success: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'User already exists or database error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ success: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Login failed' });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ error: 'No token provided' });
    }

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;
        next();
    });
};


app.post('/history', verifyToken, async (req, res) => {
    const { filename, result, date, time } = req.body;
    const userId = req.userId;

    try {
        await db.query('INSERT INTO history (user_id, filename, result, date, time) VALUES (?, ?, ?, ?, ?)', [userId, filename, result, date, time]);
        res.status(201).send({ success: 'History added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Database error' });
    }
});


app.get('/history', verifyToken, async (req, res) => {
    const userId = req.userId;

    try {
        const [rows] = await db.query('SELECT * FROM history WHERE user_id = ?', [userId]);
        res.status(200).send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
