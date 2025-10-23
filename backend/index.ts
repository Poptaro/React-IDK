import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { user } from './db/schema.ts';
import { serve } from '@hono/node-server';
import { drizzle } from 'drizzle-orm/node-postgres';


import signup from './signup.ts';
import me from './me.ts';
import signout from './signout.ts';
import login from './login.ts';
import listInstance from './listInstance.ts';
import listGroupInstance from './listGroupInstance.ts';
import listItemInstance from './listItemInstance.ts';

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();
app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.route('/signup', signup);
app.route('/login', login);
app.route('/me', me);
app.route('/signout', signout);
app.route('/listInstance', listInstance);
app.route('/listGroupInstance', listGroupInstance);
app.route('/listItemInstance', listItemInstance);

app.get('/', async (c) => {
  const result = await db.select().from(user);
  if(!result) {
    return c.json({ error: 'No users found' }, 404);
  }
  return c.json(result);
});

serve({
  fetch: app.fetch,
  port: 3000,
});