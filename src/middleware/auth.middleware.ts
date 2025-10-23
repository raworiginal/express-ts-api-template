import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({ error: "Unauthorized: No Token provided" });
			return;
		}

		const token = authHeader.split(" ")[1];

		const session = await prisma.session.findUnique({
			where: { token },
			include: { user: true },
		});

		if (!session || session.expiresAt < new Date()) {
			res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
			return;
		}

		req.user = {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name,
		};
		next();
	} catch (error) {
		console.error(`Auth middleware error: ${error}`);
		res.status(500).json({ error: `Internal server error during auth` });
	}
};
