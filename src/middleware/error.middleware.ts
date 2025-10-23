import { Request, Response, NextFunction } from "express";

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(`Error: ${err.message}`);

	res.status(500).json({
		error: "Internal server error",
		message: err.message,
	});
};

export default errorHandler;
