const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/userApi");
const authRouter = require("./routes/auth");

const app = express();

app.use(bodyParser.json());
app.use("/", authRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
