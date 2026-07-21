import{ hash, compare } from "bcrypt-ts";

async function hashPassword(password: string) {
    const hashedPassword:string = await hash(password, 10);
    return hashedPassword;
}

async function comparePassword(plainPassword: string, hashedPassword: string) {
    const isPasswordValid:boolean = await compare(plainPassword, hashedPassword);
    return isPasswordValid;
}

export { hashPassword, comparePassword };