import type { Profile, DailyLog, InsertProfile, InsertDailyLog } from "@shared/schema";

const API_BASE = "/api";

export const profileApi = {
  async create(profile: InsertProfile): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to create profile");
    return res.json();
  },

  async get(id: number): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile/${id}`);
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },

  async getAll(): Promise<Profile[]> {
    const res = await fetch(`${API_BASE}/profiles`);
    if (!res.ok) throw new Error("Failed to fetch profiles");
    return res.json();
  },

  async update(id: number, data: Partial<InsertProfile>): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },
};

export const logsApi = {
  async upsert(log: InsertDailyLog): Promise<DailyLog> {
    const res = await fetch(`${API_BASE}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
    if (!res.ok) throw new Error("Failed to save log");
    return res.json();
  },

  async get(profileId: number, date: string): Promise<DailyLog | null> {
    const res = await fetch(`${API_BASE}/logs/${profileId}/${date}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch log");
    return res.json();
  },

  async getAll(profileId: number): Promise<DailyLog[]> {
    const res = await fetch(`${API_BASE}/logs/${profileId}`);
    if (!res.ok) throw new Error("Failed to fetch logs");
    return res.json();
  },

  async update(profileId: number, date: string, updates: Partial<DailyLog>): Promise<DailyLog> {
    const res = await fetch(`${API_BASE}/logs/${profileId}/${date}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update log");
    return res.json();
  },
};
