import adminModel from "@/models/Admin";
import { comparePassword, hashPassword } from "@/lib/hash";
import { generateToken } from "@/lib/jwt";

async function loginAdmin(email: string, password: string) {

    const admin = await adminModel.findOne({ email });  

    if(!admin) {
        throw new Error("Invalid email");
    }

    const isPasswordValid = await comparePassword(password, admin.password);

    if(!isPasswordValid) {
        throw new Error("Invalid email password");
    }

    const token = generateToken(admin.id);

    return {
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        }
    }
}

async function getAdminById(id: string) {
    return await adminModel.findById(id);
}

async function updateAdminProfile(id: string, data: { name: string; email: string }) {
    const admin = await adminModel.findById(id);
    if (!admin) {
        throw new Error("Admin not found");
    }

    if (data.email !== admin.email) {
        const existing = await adminModel.findOne({ email: data.email });
        if (existing) {
            throw new Error("Email is already taken");
        }
    }

    admin.name = data.name;
    admin.email = data.email;

    await admin.save();
    return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
    };
}

async function updateAdminPassword(id: string, currentPass: string, newPass: string) {
    const admin = await adminModel.findById(id);
    if (!admin) {
        throw new Error("Admin not found");
    }

    const isPasswordValid = await comparePassword(currentPass, admin.password);
    if (!isPasswordValid) {
        throw new Error("Incorrect current password");
    }

    admin.password = await hashPassword(newPass);
    await admin.save();
}

export { loginAdmin, getAdminById, updateAdminProfile, updateAdminPassword };