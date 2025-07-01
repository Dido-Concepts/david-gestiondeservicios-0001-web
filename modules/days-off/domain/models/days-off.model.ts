export interface DaysOffModel {
  id?: number
  fecha_inicio: string
  fecha_fin: string
  hora_inicio: string
  hora_fin: string
  motivo: string
  tipo_dia_libre_maintable_id: number
  user_id: number
  created_at?: string
  updated_at?: string
}

export interface CreateDaysOffRequest {
  fecha_fin: string
  fecha_inicio: string
  hora_fin: string
  hora_inicio: string
  motivo: string
  tipo_dia_libre_maintable_id: number
  user_id: number
}
