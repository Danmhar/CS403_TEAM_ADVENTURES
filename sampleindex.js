const express = require("express");
const port = 3000;

const students = [
    { id: nextId++, name: "Alice", course: "BSCS"},
    {id: nextId++, name: "Bob", course: "BSIT"},
    {id: nextId++, name: "Cara", course: "BSCS"}
];

const app = express();

app.use(express.json());

app.post('/students', (req, res) => {
    const newName = req.body.name
    const newCourse = req.body.course
    
    const newStudent = { id: nextID++, name: newName, course: newCourse}

    students.push(newStudent)

    res.send(newStudent)
});

app.get('/students', (req, res) => {
    res.status(200).json(students);
});

app.put('/students/:id:', (req, res) => {
    const studentId = parseInt(req.params.id);
    const name = req.body.name
    const course = req.body.course
    const index = students.findIndex( s => s.id === studentId)

    if( index !== -1){
        students[index] = {id: studentId, name, course }
        res.status(200).json(students[index]);
    } else {
        res.status(404).json({ message: "student not found"})
    }
});

app.patch('/students/:id', (req, res) => {
    const student = students.find(s => s.id === studentId)

    if (student){
        if (req.body.name !== undefined) student.name = req.body.name
        if (req.body.course !== undefined) student.course = req.body.course

        res.status(200).json(student)
        res.status(404).json({ message: "Student not found"})
    }
});

app.delete('/students/:id', (req, res) => {
    const studentToDelete = students[index]

    students.splice(index, 1)

    res.status(200).json({
        message: "Student deleted successfully",
        student: studentToDelete
    })
});

app.listen(3000, () => {
    console.log("App is listening to port 3000");
});