import dotenv from "dotenv";
import { connect } from "./src/config/database.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from "./src/routes/index.js";

const app = express();

dotenv.config({
  path: ".env",
});

app.use(
  cors({
    origin: ["http://localhost:5173", "*"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.raw({ limit: "10mb", type: "image/*" }));


const PORT = process.env.PORT || 5000;
connect();
routes(app);
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Everything fine!" });
});

app.use((req, res, next) => {
  res.status(404).json({ msg: "Something Unexpected Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "An unexpected error occurred", error: err.stack });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
