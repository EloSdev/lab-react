import { z } from "zod";

export const coffeeSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
  origin: z.string().trim().min(2, "El origen debe tener al menos 2 caracteres."),
  roast: z.enum(["light", "medium", "dark"], { error: "Elige un tueste." }),
  price: z
    .number({ error: "Introduce un precio." })
    .gt(0, "El precio debe ser mayor que 0.")
    .max(100, "El precio no puede pasar de 100 €."),
  notes: z.string().max(120, "Las notas no pueden pasar de 120 caracteres."),
});
