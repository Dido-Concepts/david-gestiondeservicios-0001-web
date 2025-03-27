import { z } from 'zod'

export const formLocationManagementSchema = z.object({
  // Nombre: 2-50 caracteres, solo letras, números y espacios
  nameLocation: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre debe tener como máximo 50 caracteres')
    .regex(/^[A-Za-z0-9 ]+$/, 'El nombre no debe contener caracteres especiales'),

  // Teléfono: exactamente 9 dígitos, debe comenzar con '9'
  phoneLocation: z
    .string()
    .length(9, 'El teléfono debe tener exactamente 9 dígitos')
    .regex(/^[9]\d{8}$/, "El teléfono debe comenzar con '9' y ser seguido por 8 dígitos"),

  // Dirección: 10-100 caracteres, solo letras, números, espacios, '.' o '#'
  addressLocation: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(100, 'La dirección debe tener como máximo 100 caracteres')
    .regex(/^[A-Za-z0-9 .#]+$/, "La dirección solo debe contener letras, números, espacios, '.', o '#'"),

  // Reseña: opcional, si presente, 10-100 caracteres, solo letras, números, espacios, ',', '#' o '.'
  reviewLocation: z
    .string()
    .min(10, 'La reseña debe tener al menos 10 caracteres')
    .max(100, 'La reseña debe tener como máximo 100 caracteres')
    .regex(/^[A-Za-z0-9 .,#]+$/, "La reseña solo debe contener letras, números, espacios, ',', '#' o '.'")
    .optional(),

  // Imagen: debe ser un archivo de tipo imagen (image/*)
  imgLocation: z
    .instanceof(File)
    .refine(file => file.type.startsWith('image/'), 'La imagen debe ser un archivo de imagen válido')
})
