import Admin from "src/models/app/Admin";
import { HashPassword } from "src/utils/auth";

export const createDefaultAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ adminId: 1 });

        if (existingAdmin) {
            return;
        }

        // Create default admin
        const hashedPassword = await HashPassword("admin123");

        const admin = new Admin({
            adminId: 1,
            password: hashedPassword,
            isActive: true,
        });

        await admin.save();


    } catch (error) {
        console.error("Error creating default admin:", error);
    }
};

// Run seeder if this file is executed directly
if (require.main === module) {
    createDefaultAdmin()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error("Admin seeder failed:", error);
            process.exit(1);
        });
} 