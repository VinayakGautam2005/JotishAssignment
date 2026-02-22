import { z } from 'zod';
import { insertPhotoSchema, employeeSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  unauthorized: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  employees: {
    list: {
      method: 'GET' as const,
      path: '/api/employees' as const,
      responses: {
        200: z.array(employeeSchema),
        500: errorSchemas.internal,
      }
    }
  },
  photos: {
    create: {
      method: 'POST' as const,
      path: '/api/photos' as const,
      input: insertPhotoSchema,
      responses: {
        201: z.object({ id: z.number() }),
        400: errorSchemas.validation,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
