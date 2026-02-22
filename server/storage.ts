import { photos, type InsertPhoto, type Photo } from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getPhotos(): Promise<Photo[]>;
}

export class DatabaseStorage implements IStorage {
  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }
  async getPhotos(): Promise<Photo[]> {
    return await db.select().from(photos);
  }
}

export class MemStorage implements IStorage {
  private photos: Map<number, Photo>;
  private currentId: number;

  constructor() {
    this.photos = new Map();
    this.currentId = 1;
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const id = this.currentId++;
    const newPhoto: Photo = { ...photo, id, createdAt: new Date() };
    this.photos.set(id, newPhoto);
    return newPhoto;
  }

  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values());
  }
}

export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
