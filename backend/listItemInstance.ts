import 'dotenv/config';
import { Hono } from 'hono';
import { listItem } from './db/schema.ts';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { verifyAuth } from './middleware/auth.ts';  


const db = drizzle(process.env.DATABASE_URL!);

const listItemInstance = new Hono();


listItemInstance.get('/', async (c) => {
  const user = verifyAuth(c);
  if(!user) {
    return c.json({ "message": "Unauthorized" }, 401);
  } 
  const { listId } = await c.req.json();
  const listItems = await db.select().from(listItem).where(eq(listItem.listId, listId));
  if(!listItems) {
    return c.json({ "message": "No list items found" }, 404);
  }

  console.log("listItemInstance.ts: listItems", listItems)
  return c.json(listItems);
});

listItemInstance.get('/all/:listId', async (c) => {
  const user = verifyAuth(c);
  if(!user) {
    return c.json({ "message": "Unauthorized" }, 401);
  }
  const listId = c.req.param('listId');
  const listItems = await db.select().from(listItem).where(eq(listItem.listId, listId));
  return c.json(listItems);
})

listItemInstance.post('/', async (c) => {
  const user = verifyAuth(c);
  const { listId, name } = await c.req.json();

  if(!user) {
    return c.json({ "message": "Unauthorized" }, 401);
  }
  const newListInstance = await db.insert(listItem).values({ listId, name }).returning();
  return c.json(newListInstance);
});

export default listItemInstance;