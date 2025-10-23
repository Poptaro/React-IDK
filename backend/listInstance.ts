import 'dotenv/config';
import { Hono } from 'hono';
import { list } from './db/schema.ts';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { verifyAuth } from './middleware/auth.ts';  


const db = drizzle(process.env.DATABASE_URL!);

const listInstance = new Hono();


listInstance.get('/', async (c) => {
  const user = verifyAuth(c);
  if(!user) {
    return c.json({ "message": "Unauthorized" }, 401);
  } 
  const lists = await db.select().from(list).where(eq(list.userId, user.userId));
  return c.json(lists);
});

listInstance.post('/', async (c) => {
  const user = verifyAuth(c);

  if(!user) {
    return c.json({ "message": "Unauthorized" }, 401);
  }
  const { name, description } = await c.req.json();
  const newListInstance = await db.insert(list).values({ name, description, userId: user.userId }).returning();
  return c.json(newListInstance);
});

export default listInstance;