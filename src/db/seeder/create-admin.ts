import Admin from "src/models/Admin";
import { HashPassword } from "src/utils/auth";

export const createDefaultAdmin = async () => {
    try {
        // Check if admin already exists
        const email = "madarsagareebnawazbarikhatu@gmail.com"
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return;
        }

        // Create default admin
        const hashedPassword = await HashPassword("admin@123");

        const admin = new Admin({
            name:"Madrsa Admin",
            email:email,
            password:hashedPassword,
            password_unHashed:"admin@123",
            phone:"madrsa"
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