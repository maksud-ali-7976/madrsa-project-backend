import { createElysia } from "src/utils/createElysia";
import authRoutes from "./auth/auth.routes";
import donationRoutes from "./Donations/donation.routes";
import resultRoutes from "./Results/result.routes";
import studentRoute from "./Students/student.route";
import rolesRoutes from "./roles/roles.routes";
import attendanceRoutes from "./Attendance/attendance.route";
import classRoutes from "./class/class.routes";
import mediaRoutes from "./media/media.routes";
import adminRoutes from "./admins/admin.routes";

const adminRoute = createElysia({ prefix: "/admin" });

adminRoute.use(authRoutes);
adminRoute.use(donationRoutes);
adminRoute.use(resultRoutes);
adminRoute.use(studentRoute);
adminRoute.use(rolesRoutes);
adminRoute.use(attendanceRoutes);
adminRoute.use(classRoutes)
adminRoute.use(mediaRoutes)
adminRoute.use(adminRoutes)

export default adminRoute;
