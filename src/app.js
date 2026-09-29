const express = require("express");

const studentRoutes =
    require("./routes/studentRoutes");

const authRoutes =
    require("./routes/authRoutes");

const swaggerUi = 
    require('swagger-ui-express');

const swaggerSpec = 
    require('./config/swagger');


const app = express();


app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
    "/auth",
    authRoutes
);


app.use(
    "/students",
    studentRoutes
);


module.exports = app;