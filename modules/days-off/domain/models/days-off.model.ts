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

// Nuevo modelo para actualizar detalles de días libres
export interface UpdateDaysOffDetailsRequest {
  tipo_dia_libre_maintable_id?: number
  fecha_inicio?: string
  fecha_fin?: string
  hora_inicio?: string
  hora_fin?: string
  motivo?: string
}

// Modelo para los tipos de días libres de la API de maintable
export interface DayOffTypeModel {
  maintable_id: number
  parent_maintable_id: number | null
  table_name: string
  item_text: string
  item_value: string
  item_order: number
  description: string
  insert_date: string
  update_date: string
  user_create: string
  user_modify: string | null
}

// Modelo para la respuesta paginada de la API
export interface DayOffTypesResponse {
  data: DayOffTypeModel[]
  meta: {
    page: number
    page_size: number
    page_count: number
    total: number
  }
}

// Parámetros para obtener los tipos de días libres
export interface GetDayOffTypesParams {
  table_name: string
  page_index: number
  page_size: number
  order_by?: string
  sort_by?: 'ASC' | 'DESC'
  query?: string
  fields?: string
}
