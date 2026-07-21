import { sign, verify } from "jsonwebtoken";

function generateToken(user_id: string) {
    const jwt_secret = process.env.JWT_SECRET;
    
    if (!jwt_secret){
        throw new Error("JWT key error")
    }
    const token = sign({
        id: user_id
    }, jwt_secret)

    return token;
}

function verifyAndDecodeToken(token: string) {

    const jwt_secret = process.env.JWT_SECRET;
    
    if (!jwt_secret){
        throw new Error("JWT key error");
    }
    const decoded = verify(token, jwt_secret);

    return decoded;
}

export { generateToken, verifyAndDecodeToken }; 