import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.auth.login.path, (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      if (input.username === "testuser" && input.password === "Test123") {
        res.status(200).json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      res.status(401).json({ message: "Invalid request" });
    }
  });

  app.get(api.employees.list.path, async (req, res) => {
    try {
      const response = await fetch("https://backend.jotish.in/backend_dev/gettabledata.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "test", password: "123456" })
      });
      const data = await response.json();
      const employees = data.TABLE_DATA.data.map((row: string[]) => ({
        name: row[0],
        role: row[1],
        city: row[2],
        employeeId: row[3],
        startDate: row[4],
        salary: row[5]
      }));
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.post(api.photos.create.path, async (req, res) => {
    try {
      const input = api.photos.create.input.parse(req.body);
      const photo = await storage.createPhoto(input);
      res.status(201).json({ id: photo.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(400).json({ message: "Invalid request" });
    }
  });

  return httpServer;
}
