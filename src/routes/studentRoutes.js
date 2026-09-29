const express = require("express");

const studentController =
    require("../controllers/studentController");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *       401:
 *         description: Missing or invalid token
 *       500:
 *         description: Database error
 */
router.get("/", authenticateToken, studentController.getStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get one student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found
 *       400:
 *         description: Invalid student ID
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Student not found
 *       500:
 *         description: Database error
 */
router.get("/:id", authenticateToken, studentController.getStudent);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, course]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Dela Cruz
 *               course:
 *                 type: string
 *                 example: BSIT
 *     responses:
 *       201:
 *         description: Student created
 *       400:
 *         description: Name and course are required
 *       401:
 *         description: Missing or invalid token
 *       500:
 *         description: Database error
 */
router.post("/", authenticateToken, studentController.createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Dela Cruz
 *               course:
 *                 type: string
 *                 example: BSIT
 *     responses:
 *       200:
 *         description: Student updated
 *       400:
 *         description: Invalid student ID
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Student not found
 *       500:
 *         description: Database error
 */
router.put("/:id", authenticateToken, studentController.updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted
 *       400:
 *         description: Invalid student ID
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Student not found
 *       500:
 *         description: Database error
 */
router.delete("/:id", authenticateToken, studentController.deleteStudent);

module.exports = router;