import { 
  type User, 
  type InsertUser,
  type Profile,
  type InsertProfile,
  type DailyLog,
  type InsertDailyLog,
  type UpdateDailyLog,
  users,
  profiles,
  dailyLogs,
} from "@shared/schema";
import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(id: number): Promise<Profile | undefined>;
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  getAllProfiles(): Promise<Profile[]>;
  
  // Daily Log methods
  getDailyLog(profileId: number, date: string): Promise<DailyLog | undefined>;
  getDailyLogsByProfile(profileId: number): Promise<DailyLog[]>;
  upsertDailyLog(log: InsertDailyLog): Promise<DailyLog>;
  updateDailyLog(profileId: number, date: string, updates: Partial<UpdateDailyLog>): Promise<DailyLog | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Profile methods
  async getProfile(id: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(id: number, profileData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [updated] = await db
      .update(profiles)
      .set(profileData)
      .where(eq(profiles.id, id))
      .returning();
    return updated;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles).orderBy(desc(profiles.createdAt));
  }

  // Daily Log methods
  async getDailyLog(profileId: number, date: string): Promise<DailyLog | undefined> {
    const [log] = await db
      .select()
      .from(dailyLogs)
      .where(and(eq(dailyLogs.profileId, profileId), eq(dailyLogs.date, date)));
    return log;
  }

  async getDailyLogsByProfile(profileId: number): Promise<DailyLog[]> {
    return await db
      .select()
      .from(dailyLogs)
      .where(eq(dailyLogs.profileId, profileId))
      .orderBy(desc(dailyLogs.date));
  }

  async upsertDailyLog(log: InsertDailyLog): Promise<DailyLog> {
    const existing = await this.getDailyLog(log.profileId, log.date);
    
    if (existing) {
      const updateData: any = { ...log, updatedAt: new Date() };
      const [updated] = await db
        .update(dailyLogs)
        .set(updateData)
        .where(and(eq(dailyLogs.profileId, log.profileId), eq(dailyLogs.date, log.date)))
        .returning();
      return updated;
    } else {
      const [newLog] = await db.insert(dailyLogs).values(log as any).returning();
      return newLog;
    }
  }

  async updateDailyLog(profileId: number, date: string, updates: Partial<UpdateDailyLog>): Promise<DailyLog | undefined> {
    const updateData: any = { ...updates, updatedAt: new Date() };
    const [updated] = await db
      .update(dailyLogs)
      .set(updateData)
      .where(and(eq(dailyLogs.profileId, profileId), eq(dailyLogs.date, date)))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
