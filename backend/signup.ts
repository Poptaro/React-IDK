import 'dotenv/config';
import { Hono } from 'hono';
import { user } from './db/schema.ts';
import { drizzle } from 'drizzle-orm/node-postgres';
import { setCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';


const db = drizzle(process.env.DATABASE_URL!);
const privateKey = (process.env.PRIVATE_KEY!);

const signup = new Hono();


signup.post('/', async (c) => {
  const body = await c.req.json();
  const { username, password } = body;
  if(username < 1) {
    return c.json({ "message": "Username is required" }, 400);
  }
  if(password < 1) {
    return c.json({ "message": "Password is required" }, 400);
  }
  try {
    const hashedPassword = await argon2.hash(password);
    const result = await db.insert(user).values({ username, password: hashedPassword }).returning();
    if(result.length === 0) {
      return c.json({ "message": "Error creating user in signup.ts" }, 500);
    }
    console.log("result", result)
    const token = jwt.sign({ userId: result[0].id, username: result[0].username }, privateKey, { algorithm: 'HS256', expiresIn: '24h' });
    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'Strict',
      domain: 'localhost',
      maxAge: 60 * 60 * 24, //24 hours
    });
    return c.json({ "message": "User Created Successfully" }, 201)
  } catch (error) {
    return c.json({ "message": "Error creating user", "error": error }, 500);
  }
});

export default signup