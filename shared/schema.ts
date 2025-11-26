import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  weight: text("weight").notNull(),
  height: text("height").notNull(),
  belt: text("belt").notNull(),
  startDate: text("start_date").notNull(),
  competitionDate: text("competition_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  completedItems: json("completed_items").$type<string[]>().notNull().default([]),
  journalEntry: text("journal_entry").notNull().default(""),
  weight: text("weight"),
  mood: integer("mood"),
  sleepHours: text("sleep_hours"),
  sleepQuality: text("sleep_quality"),
  hrv: text("hrv"),
  restingHR: text("resting_hr"),
  activeCalories: text("active_calories"),
  dailyFocus: text("daily_focus"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

export const insertDailyLogSchema = createInsertSchema(dailyLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update Schema for Daily Logs (partial updates)
export const updateDailyLogSchema = insertDailyLogSchema.partial().required({ profileId: true, date: true });

// Types
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertDailyLog = z.infer<typeof insertDailyLogSchema>;
export type UpdateDailyLog = z.infer<typeof updateDailyLogSchema>;
export type DailyLog = typeof dailyLogs.$inferSelect;
