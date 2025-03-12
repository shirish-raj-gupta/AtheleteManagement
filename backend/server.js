require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./src/routes/authRoutes");
const athleteRoutes = require("./src/routes/athleteRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);


app.get("/", (req, res) => res.send("Athlete Management API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
