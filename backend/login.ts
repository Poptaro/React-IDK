import 'dotenv/config';
import { Hono } from 'hono';
import { user } from './db/schema.ts';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { setCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';


const db = drizzle(process.env.DATABASE_URL!);
const privateKey = (process.env.PRIVATE_KEY!);

const login = new Hono();


login.post('/', async (c) => {
  const body = await c.req.json();
  const { username, password } = body;
  if(username < 1) {
    return c.json({ "message": "Username is required" }, 400);
  }
  if(password < 1) {
    return c.json({ "message": "Password is required" }, 400);
  }
  try {
    const foundUser = await db.select().from(user).where(eq(user.username, username));
    console.log("foundUser", foundUser)
    if(foundUser.length === 0) {
      return c.json({ "message": "User not found" }, 404);
    }
    const hashedPassword = await argon2.verify(foundUser[0].password, password);
    if(!hashedPassword) {
      return c.json({ "message": "Invalid password" }, 401);
    }
    const token = jwt.sign({ userId: foundUser[0].id, username: foundUser[0].username }, privateKey, { algorithm: 'HS256', expiresIn: '24h' });
    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'Strict',
      domain: 'localhost',
      maxAge: 60 * 60 * 24, //24 hours
    });
    return c.json({ "message": "Successfully Logged In" }, 201)
  } catch (error) {
    return c.json({ "message": "Error logging in", error }, 500);
  }
  // return c.json({ result, "message": "User created successfully" });
});

export default login