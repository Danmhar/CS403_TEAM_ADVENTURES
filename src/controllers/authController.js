const bcrypt = require("bcryptjs");

const authModel = require("../models/authModel");

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken,
} = require("../services/tokenService");


const createTokenPair = async (student) => {

    const accessToken =
        generateAccessToken(student);

    const refreshToken =
        generateRefreshToken(student);

    const refreshTokenHash =
        hashToken(refreshToken);

    const decoded = verifyRefreshToken(
        refreshToken
    );

    const expiresAt =
        new Date(decoded.exp * 1000);

    await authModel.saveRefreshToken(
        student.id,
        refreshTokenHash,
        expiresAt
    );

    return {
        accessToken,
        refreshToken
    };
};


const {
    isText,
    isEmail,
    isPassword
} = require("../validations/validators");

// REGISTER
const register = async (request, response) => {

    try {

        const {
            name,
            course,
            email,
            password
        } = request.body || {};


        if (!isText(name, 100)) {
            return response.status(400).send({
                message: "Name is required and must be valid text"
            });
        }

        if (!isText(course, 50)) {
            return response.status(400).send({
                message: "Course is required and must be valid text"
            });
        }

        if (!isEmail(email)) {
            return response.status(400).send({
                message: "A valid email is required"
            });
        }

        if (!isPassword(password)) {
            return response.status(400).send({
                message: "Password must be at least 8 characters"
            });
        }


        const existingStudent =
            await authModel.findStudentByEmail(
                email
            );


        if (existingStudent) {
            return response.status(409).send({
                message:
                    "Email is already registered"
            });
        }


        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );


        const student =
            await authModel.createStudent(
                name,
                course,
                email.toLowerCase(),
                passwordHash
            );


        response.status(201).send({
            message:
                "Student registered successfully",

            student
        });

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        response.status(500).send({
            message:
                "Registration failed"
        });
    }
};

// LOGIN
const login = async (request, response) => {

    try {

        const {
            email,
            password
        } = request.body || {};


        if (!email || !password) {
            return response.status(400).send({
                message:
                    "Email and password are required"
            });
        }


        const student =
            await authModel.findStudentByEmail(
                email
            );


        if (!student) {
            return response.status(401).send({
                message:
                    "Invalid email or password"
            });
        }


        const passwordIsValid =
            await bcrypt.compare(
                password,
                student.password_hash
            );


        if (!passwordIsValid) {
            return response.status(401).send({
                message:
                    "Invalid email or password"
            });
        }


        const {
            accessToken,
            refreshToken
        } = await createTokenPair(student);


        response.send({

            message:
                "Login successful",

            accessToken,

            refreshToken,

            student: {
                id: student.id,
                name: student.name,
                course: student.course,
                email: student.email
            }
        });

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        response.status(500).send({
            message:
                "Login failed"
        });
    }
};


// REFRESH TOKEN
const refresh = async (
    request,
    response
) => {

    try {

        const {
            refreshToken
        } = request.body || {};


        if (!refreshToken) {
            return response.status(400).send({
                message:
                    "Refresh token is required"
            });
        }


        const payload =
            verifyRefreshToken(
                refreshToken
            );


        const tokenHash =
            hashToken(
                refreshToken
            );


        const savedToken =
            await authModel.findRefreshToken(
                tokenHash
            );


        if (!savedToken) {
            return response.status(401).send({
                message:
                    "Invalid or revoked refresh token"
            });
        }


        const student =
            await authModel.findStudentById(
                payload.sub
            );


        if (!student) {
            return response.status(401).send({
                message:
                    "Student no longer exists"
            });
        }


        // Refresh-token rotation
        await authModel.deleteRefreshToken(
            tokenHash
        );


        const newTokens =
            await createTokenPair(
                student
            );


        response.send({
            message:
                "Token refreshed successfully",

            ...newTokens
        });

    } catch (error) {

        console.error(
            "REFRESH ERROR:",
            error
        );

        response.status(401).send({
            message:
                "Invalid or expired refresh token"
        });
    }
};


// LOGOUT
const logout = async (
    request,
    response
) => {

    try {

        const {
            refreshToken
        } = request.body || {};


        if (!refreshToken) {
            return response.status(400).send({
                message:
                    "Refresh token is required"
            });
        }


        const tokenHash =
            hashToken(
                refreshToken
            );


        await authModel.deleteRefreshToken(
            tokenHash
        );


        response.send({
            message:
                "Logout successful"
        });

    } catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );

        response.status(500).send({
            message:
                "Logout failed"
        });
    }
};


module.exports = {
    register,
    login,
    refresh,
    logout
};