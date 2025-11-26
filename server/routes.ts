import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertDailyLogSchema, updateDailyLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Profile Routes
  app.post("/api/profile", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/profile/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const profile = await storage.getProfile(id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  });

  app.get("/api/profiles", async (req, res) => {
    const profiles = await storage.getAllProfiles();
    res.json(profiles);
  });

  app.patch("/api/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateProfile(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Daily Log Routes
  app.get("/api/logs/:profileId", async (req, res) => {
    const profileId = parseInt(req.params.profileId);
    const logs = await storage.getDailyLogsByProfile(profileId);
    res.json(logs);
  });

  app.get("/api/logs/:profileId/:date", async (req, res) => {
    const profileId = parseInt(req.params.profileId);
    const { date } = req.params;
    const log = await storage.getDailyLog(profileId, date);
    if (!log) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.json(log);
  });

  app.post("/api/logs", async (req, res) => {
    try {
      const logData = insertDailyLogSchema.parse(req.body);
      const log = await storage.upsertDailyLog(logData);
      res.json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/logs/:profileId/:date", async (req, res) => {
    try {
      const profileId = parseInt(req.params.profileId);
      const { date } = req.params;
      const updated = await storage.updateDailyLog(profileId, date, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Log not found" });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
