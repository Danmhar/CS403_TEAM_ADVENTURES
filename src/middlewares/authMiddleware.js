const jwt = require("jsonwebtoken");

const authMiddleware = (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return response.status(401).json({
                message: "Access token is required"
            });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return response.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        request.user = decoded;

        next();

    } catch (error) {
        return response.status(401).json({
            message: "Invalid or expired access token"
        });
    }
};

module.exports = authMiddleware;