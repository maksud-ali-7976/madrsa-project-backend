import { createElysia } from "src/utils/createElysia";
import authRoutes from "./auth/auth.routes";
import donationRoutes from "./Donations/donation.routes";
import resultRoutes from "./Results/result.routes";
import studentRoute from "./Students/student.route";

const adminRoutes = createElysia({ prefix: "/admin" });

adminRoutes.use(authRoutes);
adminRoutes.use(donationRoutes);
adminRoutes.use(resultRoutes);
adminRoutes.use(studentRoute)

export default adminRoutes;
