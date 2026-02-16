import { customError } from "src/utils/AppErr";
import jwt from "src/utils/jwt";
import Admin from "src/models/app/Admin";

export const isAdminAuthenticated = async (request: any) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw customError("Access token required", 401);
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token) as any;

        if (!decoded || !decoded.adminId) {
            throw customError("Invalid token", 401);
        }

        // Check if admin exists and is active
        const admin = await Admin.findOne({
            adminId: decoded.adminId,
            isActive: true
        });

        if (!admin) {
            throw customError("Admin not found or inactive", 404);
        }

        // Attach admin to request
        request.admin = { ...(admin.toObject()), token: token };

    } catch (error: any) {
        if (error.name === "JsonWebTokenError") {
            throw customError("Invalid token", 401);
        }
        if (error.name === "TokenExpiredError") {
            throw customError("Token expired", 401);
        }
        throw error;
    }
}; 