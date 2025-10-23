import 'dotenv/config';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';


const signout = new Hono();


signout.post('/', async (c) => {
  try {
    setCookie(c, 'token', '', {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'Strict',
      domain: 'localhost',
      maxAge: 0,
    });
    return c.json({ "message": "User Signed Out Successfully" }, 201)
  } catch (error) {
    return c.json({ "message": "Error signing out", "error": error }, 500);
  }
});

export default signout