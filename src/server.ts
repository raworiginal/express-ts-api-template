import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.all("/api/auth/*splat", toNodeHandler(auth));

//middleware to parse JSON
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
	res.json({ status: "ok", message: `Server is running on port ${PORT}` });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
