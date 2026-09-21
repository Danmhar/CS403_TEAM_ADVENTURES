const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentModel = require("../models/studentModel");

const register = async (name, email, password) => {
    const existingStudent = studentModel.findStudentByEmail(email);

    if (existingStudent) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = studentModel.createStudent(
        name,
        "Not yet assigned",
        email,
        hashedPassword,
       "user"
    );

    return {
        id: student.id,
        name: student.name,
        email: student.email,
        course: student.course,
        role: student.role
    };
};

const login = async (email, password) => {
    const student = studentModel.findStudentByEmail(email);

    if (!student) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        student.password
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const accessToken = jwt.sign(
        {
            sub: student.id,    
            role: student.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
            algorithm: "HS256"
        }
    );

    return {
        accessToken,
        user: {
            id: student.id,
            name: student.name,
            email: student.email,
            course: student.course,
            role: student.role
        }
    };
};

module.exports = {
    register,
    login
};