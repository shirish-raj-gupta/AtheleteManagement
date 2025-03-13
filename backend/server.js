require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./src/routes/authRoutes");
const athleteRoutes = require("./src/routes/athleteRoutes");
const coachRoutes = require("./src/routes/coachRoutes");
const plannerRoutes = require("./src/routes/plannerRoutes");
const schedulerRoutes = require("./src/routes/schedulerRoutes");
const managerRoutes = require("./src/routes/managerRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const aiTrainingRoutes = require("./src/routes/aiTrainingRoutes");
const aiChatbotRoutes = require("./src/routes/aiChatbotRoutes");
const aiSchedulerRoutes = require("./src/routes/aiSchedulerRoutes");
const realTimeRoutes = require("./src/routes/realTimeRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/coaches", coachRoutes); // ✅ Added Coach Routes
app.use("/api/managers", managerRoutes); 
app.use("/api/planners", plannerRoutes);
app.use("/api/schedulers", schedulerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", aiTrainingRoutes);
app.use("/api/ai", aiChatbotRoutes);
app.use("/api/ai/scheduler", aiSchedulerRoutes);
app.use("/api/realtime", realTimeRoutes);

app.get("/", (req, res) => res.send("Athlete Management API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
