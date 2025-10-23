// backend/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';
import 'dotenv/config';

export function verifyAuth(c: any) {
  const token = getCookie(c, 'token');
  if (!token) {
    return null; // Return null instead of sending response
  }

  try {
    const user = jwt.verify(token, process.env.PRIVATE_KEY!) as { userId: number, username: string, iat: number, exp: number };
    return user; // Return the user data
  } catch {
    return null; // Return null instead of sending response
  }
}
