import express, { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "./lib/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware to parse JSON
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
	res.json({ status: "ok", message: `Server is running on port ${PORT}` });
});

app.get("/users", async (req: Request, res: Response) => {
	const users = await prisma.user.findMany();
	res.json({ users });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
