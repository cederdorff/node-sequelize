// ========== 0. imports and app setup =========== //
import cors from "cors";
import express from "express";
import { router } from "./routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // to parse JSON bodies
app.use(cors()); // to allow cross-origin requests
app.use("/", router); // to use the routes defined in routes.js

// ========== Start Server  =========== //

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
