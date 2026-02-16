import { createElysia } from "src/utils/createElysia";
import authRoutes from "./auth/auth.routes";


const adminRoutes = createElysia({ prefix: "/admin" });

adminRoutes.use(authRoutes);

export default adminRoutes;
