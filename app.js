const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",  
    database: "track"  
});
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL!");
    }
});

app.post("/add-transaction", (req, res) => {
    const { amount, type } = req.body;

    if (!amount || !type) {
        return res.status(400).json({ message: "Amount and type are required" });
    }
    db.query("INSERT INTO expense (money, type) VALUES (?, ?)", [amount, type], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send(err);
        } else {
            res.json({ message: "Transaction added successfully!" });
        }
    });
});

app.get("/get-transactions", (req, res) => {
    db.query("SELECT * FROM expense", (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.get("/get-total-transactions", (req, res) => {
    db.query("SELECT SUM(money) AS totalSavings FROM expense WHERE type = 'Saving'", (err, savingsResult) => {
        if (err) {
            console.error("Error fetching savings data:", err);
            return res.status(500).send(err);
        }

        db.query("SELECT SUM(money) AS totalExpenses FROM expense WHERE type = 'Expense'", (err, expensesResult) => {
            if (err) {
                console.error("Error fetching expenses data:", err);
                return res.status(500).send(err);
            }

            const totalSavings = savingsResult[0].totalSavings || 0;
            const totalExpenses = expensesResult[0].totalExpenses || 0;

            res.json({ totalSavings, totalExpenses });
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
