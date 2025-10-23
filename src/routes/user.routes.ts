import { Router, Request, Response } from "express";
import requireAuth from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", requireAuth, (req: Request, res: Response) => {
	res.json({
		message: "This is a protected route",
		user: req.user,
	});
});

router.get("/dashboard", requireAuth, (req: Request, res: Response) => {
	res.json({
		message: "Welcome to your dashboard!",
		user: req.user,
	});
});

export default router;
