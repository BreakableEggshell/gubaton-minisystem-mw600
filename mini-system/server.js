const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "task_db",
    dateStrings: true
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});

app.get("/api/tasks", (req, res) => {
    const sql = "SELECT * FROM tasks ORDER BY id";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

app.post("/api/tasks", (req, res) => {
    const title = (req.body.title || "").trim();
    const status = req.body.status || "todo";
    const due_date = req.body.due_date || null;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    if (!["todo", "in-progress", "done"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const sql = "INSERT INTO tasks (title, status, due_date) VALUES (?, ?, ?)";

    db.query(sql, [title, status, due_date], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({
            message: "Task added successfully",
            id: result.insertId
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
