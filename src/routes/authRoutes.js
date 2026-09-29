const express = require("express");

const {
    register,
    login,
    refresh,
    logout
} = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, course, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Dela Cruz
 *               course:
 *                 type: string
 *                 example: BSIT
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Name, course, email and password are required
 *       409:
 *         description: Email is already registered
 *       500:
 *         description: Registration failed
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and receive tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, access and refresh tokens returned
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Login failed
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Get a new access token and refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Refresh token is required
 *       401:
 *         description: Invalid, revoked, or expired refresh token
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out and revoke the refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Refresh token is required
 *       500:
 *         description: Logout failed
 */
router.post("/logout", logout);

module.exports = router;