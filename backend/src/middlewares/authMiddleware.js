import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

  if (!token) return errorResponse(res,"Missing token", 401);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return errorResponse(res, "Invalid Token", 401);
  }
}

export function allowRoles(...allow) {
  const allowLower = allow.map((r) => r.toLowerCase());
  return (req, res, next) => {
    const roleName = req.user?.role?.toLowerCase();
    if (!roleName) return errorResponse(res,"Unauthenticated", 401);
    if (!allowLower.includes(roleName)) {
      return  errorResponse(res, "Forbidden", 403);
    }
    next();
  };
}