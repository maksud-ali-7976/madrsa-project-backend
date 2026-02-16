import User from "src/models/app/User";
import Admin from "src/models/app/Admin";
import { createDefaultAdmin } from "./create-admin";

export const seeder = async () => {
    // await reset();

    User.syncIndexes({});
    Admin.syncIndexes({});

    // Create default admin
    await createDefaultAdmin();

    return true;
}

