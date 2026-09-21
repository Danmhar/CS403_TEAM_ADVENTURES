const express = require("express");

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const studentModel = require("./models/studentModel");
const authMiddleware = require("./middlewares/authMiddleware");
const adminMiddleware = require("./middlewares/adminMiddleware");

const app = express();

app.use(express.json());

app.use("/students", studentRoutes);
app.use("/auth", authRoutes);

app.get("/profile", authMiddleware, (request, response) => {
    response.send({
        message: "Profile accessed successfully",
        user: request.user
    });
});

app.get(
    "/admin/users",
    authMiddleware,
    adminMiddleware,
    (request, response) => {
        const students = studentModel.getAllStudents();

        const users = students.map((student) => ({
            id: student.id,
            name: student.name,
            course: student.course,
            email: student.email,
            role: student.role
        }));

        response.json({
            users
        });
    }
);

module.exports = app;