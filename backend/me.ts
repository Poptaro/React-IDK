//Find current user//

import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { drizzle } from 'drizzle-orm/node-postgres';
import jwt from 'jsonwebtoken';
import { user } from './db/schema.ts';
import { eq } from 'drizzle-orm';

const me = new Hono();

const db = drizzle(process.env.DATABASE_URL!);

// me.use('*', cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

me.get('/', async (c) => {
  const token = getCookie(c, 'token');
  // console.log("token", token)
  if(!token) {
    return c.json({ error: 'No User Logged In' }, 401);
  }
  const decoded = jwt.verify(token, process.env.PRIVATE_KEY!) as { userId: number, username: string, iat: number, exp: number };
  if(!decoded) {
    return c.json({ error: 'Invalid Token' }, 401);
  }
  const foundUser = await db.select().from(user).where(eq(user.username, decoded.username));
  // console.log("me.ts: foundUser", foundUser)
  return c.json({id: foundUser[0].id, username: foundUser[0].username});
});

export default me;