import { sql } from "drizzle-orm";
import { pgTable, integer, text, check, serial } from "drizzle-orm/pg-core"

export const user = pgTable('users', {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});


export const list = pgTable('list', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, {
			onDelete: "cascade"
		}),
	name: text('name').notNull(),
	description: text('description').default("No description"),
})

export const listGroup = pgTable('list_group', {
	id: serial('id').primaryKey(),
	listId: integer('list_id')
	.notNull()
	.references(() => list.id, {
		onDelete: "cascade"
	}),
	name: text('name').default("Group"),
})

export const listItem = pgTable('list_item', {
	id: serial('id').primaryKey(),
	listId: integer('list_id')
		.notNull()
		.references(() => list.id, {
			onDelete: "cascade"
		}),
	name: text('name').notNull(),
	weight: integer('weight').default(100).notNull(),
	listGroupId: integer('list_group_id')
		.references(() => listGroup.id, {
			onDelete: "cascade"
		}),
},
	(table) => [
		check("weight_check1", sql`${table.weight} >= 0`),
		check("weight_check2", sql`${table.weight} <= 100`)
	]
)