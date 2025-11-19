/* eslint-disable no-unused-vars */
export enum ShiftStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled'
}

export interface ShiftModel {
  id?: number
  fecha_turno: string
  hora_inicio: string
  hora_fin: string
  sede_id: number
  user_id: number
  status?: ShiftStatus
  created_at?: string
  updated_at?: string
}

export interface CreateShiftRequest {
  fecha_turno: string
  hora_inicio: string
  hora_fin: string
  sede_id: number
  user_id: number
}

export interface UpdateShiftRequest {
  fecha_turno?: string
  hora_inicio?: string
  hora_fin?: string
  sede_id?: number
  user_id?: number
}

// Nueva interfaz para actualizar detalles del turno
export interface UpdateShiftDetailsRequest {
  fecha_turno?: string
  hora_inicio?: string
  hora_fin?: string
}

// Nueva interfaz para eliminación lógica
export interface CancelShiftRequest {
  shift_id: number
}
