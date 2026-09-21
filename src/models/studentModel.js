const bcrypt = require("bcryptjs");

let nextId = 1;

const students = [
    {
        id: nextId++,
        name: "Alice",
        course: "BSCS",
        email: "alice@example.com",
        password: null,
        role: "user"
    },
    {
        id: nextId++,
        name: "Bob",
        course: "BSIT",
        email: "bob@example.com",
        password: null,
        role: "user"
    },
    {
        id: nextId++,
        name: "Cara",
        course: "BSCS",
        email: "cara@example.com",
        password: null,
        role: "user"
    },
    
    {
        id: nextId++,
        name: "Admin Student",
        course: "Not yet assigned",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        role: "admin"
     }
];

const getAllStudents = () => {
    return students;
};

const getStudentById = (id) => {
    return students.find((student) => student.id === id);
};

const createStudent = (
    name,
    course,
    email = null,
    password = null,
    role = "user"
) => {
    const newStudent = {
        id: nextId++,
        name,
        course,
        email,
        password,
        role,
    };

    students.push(newStudent);

    return newStudent;
};

const findStudentByEmail = (email) => {
    return students.find((student) => student.email === email);
};

const updateStudent = (id, name, course) => {
    const student = students.find((student) => student.id === id);

    if (!student) {
        return null;
    }

    if (name) {
        student.name = name;
    }

    if (course) {
        student.course = course;
    }

    return student;
};

const deleteStudent = (id) => {
    const index = students.findIndex((student) => student.id === id);

    if (index === -1) {
        return null;
    }

    return students.splice(index, 1)[0];
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    findStudentByEmail,
    updateStudent,
    deleteStudent,
    getAllStudents,
};