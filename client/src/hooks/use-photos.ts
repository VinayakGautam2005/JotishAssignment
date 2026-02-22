import { useMutation } from "@tanstack/react-query";
import { api, type InsertPhoto } from "@shared/routes";

export function useUploadPhoto() {
  return useMutation({
    mutationFn: async (data: InsertPhoto) => {
      const validated = api.photos.create.input.parse(data);
      
      const res = await fetch(api.photos.create.path, {
        method: api.photos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload photo");
      }

      return api.photos.create.responses[201].parse(await res.json());
    },
  });
}
