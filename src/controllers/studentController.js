const studentModel = require("../models/studentModel");
const { isStudentId, isText } = require("../validations/validators");

const getStudents = async (request, response) => {
    try {
        const students = await studentModel.getAllStudents();

        response.send(students);
    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

const getStudent = async (request, response) => {
    try {
        if (!isStudentId(request.params.id)) {
            return response.status(400).send({ message: "Invalid student ID" });
        }
        const id = Number(request.params.id);

        const student = await studentModel.getStudentById(id);

        if (!student) {
            return response.status(404).send({
                message: "Student not found",
            });
        }

        response.send(student);
    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

const createStudent = async (request, response) => {
    try {
        const { name, course } = request.body || {};

        if (!isText(name, 100)) {
            return response.status(400).send({
                message: "Name is required and must be valid text",
            });
        }

        if (!isText(course, 50)) {
            return response.status(400).send({
                message: "Course is required and must be valid text",
            });
        }

        const newStudent = await studentModel.createStudent(
            name,
            course
        );

        response.status(201).send(newStudent);

    } catch (error) {
        console.error("CREATE STUDENT ERROR:", error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

const updateStudent = async (request, response) => {
    try {
        if (!isStudentId(request.params.id)) {
            return response.status(400).send({ message: "Invalid student ID" });
        }
        const id = Number(request.params.id);

        const { name, course } = request.body || {};

        const updatedStudent = await studentModel.updateStudent(
            id,
            name ?? null,
            course ?? null
        );

        if (!updatedStudent) {
            return response.status(404).send({
                message: "Student not found",
            });
        }

        response.send(updatedStudent);
    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

const deleteStudent = async (request, response) => {
    try {
        if (!isStudentId(request.params.id)) {
            return response.status(400).send({ message: "Invalid student ID" });
        }
        const id = Number(request.params.id);

        const deletedStudent = await studentModel.deleteStudent(id);

        if (!deletedStudent) {
            return response.status(404).send({
                message: "Student not found",
            });
        }

        response.send(deletedStudent);
    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
};