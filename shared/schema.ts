import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({ id: true, createdAt: true });

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;

export const employeeSchema = z.object({
  name: z.string(),
  role: z.string(),
  city: z.string(),
  employeeId: z.string(),
  startDate: z.string(),
  salary: z.string(),
});

export type Employee = z.infer<typeof employeeSchema>;
