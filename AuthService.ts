import jwt from 'jsonwebtoken';

const SECRET_KEY = 'SECRET';
const TOKEN_EXPIRATION = '24h'; // Token expiration time

//Move this to a dedicated file
type UserData = {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    hobbies: string[];
    email: string;
    password: string;
    avatarUrl: string;
    gender: string;
    accountType: string;
    role: string;
};

class AuthService {
    static generateToken(user: UserData): string {
        return jwt.sign(user, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
    }

    static verifyToken(token: string): jwt.JwtPayload | string {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    static getUserFromToken(token: string): UserData | null {
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
            return decoded as UserData;
        } catch (error) {
            return null;
        }
    }
}

export default AuthService;
