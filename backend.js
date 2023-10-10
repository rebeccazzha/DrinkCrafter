import express from "express";
import api from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("static"));

app.use("/api", api);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
