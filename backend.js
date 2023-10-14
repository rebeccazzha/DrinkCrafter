import express from "express";
import api from "./routes/api.js";
import api2 from "./routes/api2.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("static"));
app.use(express.json());

app.use("/api", api);
app.use("/api2", api2);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
