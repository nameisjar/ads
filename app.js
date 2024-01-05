require("dotenv").config();
const { PORT = 3000 } = process.env
const express = require("express");
const cors = require("cors");
const router = require("./routes/index.routes");
const {notFoundHandler, internalErrorHandler} = require("./middlewares/error.middlewares")
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger.json");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use(notFoundHandler);
app.use(internalErrorHandler);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
module.exports = app