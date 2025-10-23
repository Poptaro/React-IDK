import 'dotenv/config';
import { Hono } from 'hono';
import { listGroup } from './db/schema.ts';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { verifyAuth } from './middleware/auth.ts';  


const db = drizzle(process.env.DATABASE_URL!);

const listGroupInstance = new Hono();

//Get singular Group Instance
listGroupInstance.get('/', async (c) => {
  const user = verifyAuth(c);
  if(!user) {
    return c.json({ "message": "Unauthorized" }, 401);
  } 
  const listId = await c.req.param('listId');
  const listGroups = await db.select().from(listGroup).where(eq(listGroup.listId, listId));
  if(!listGroups) {
    return c.json({ "message": "No list groups found" }, 404);
  }
  console.log("listGroupInstance.ts: listGroups", listGroups)
  return c.json(listGroups);
});

//Get all Group Instance
listGroupInstance.get('/all/:listId', async (c) => {
  const user = verifyAuth(c);
  const listId = c.req.param('listId');
  if(!user) {
    return c.json({ "message": "Unauthorized" }, 401);
  }
  console.log("listGroupInstance.ts: listId", listId)
  const listGroups = await db.select().from(listGroup).where(eq(listGroup.listId, listId));
  if(!listGroups) {
    return c.json({ "message": "No list groups found" }, 404);
  }
  return c.json(listGroups);
});

listGroupInstance.post('/', async (c) => {
  const user = verifyAuth(c);
  const { listId, name } = await c.req.json();

  if(!user) {
    return c.json({ "message": "Unauthorized" }, 401);
  }
  const newListInstance = await db.insert(listGroup).values({ listId, name }).returning();
  return c.json(newListInstance);
});

export default listGroupInstance;