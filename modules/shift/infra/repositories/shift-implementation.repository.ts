import { axiosApiInterna } from '@/config/axiosApiInterna'
import { ShiftRepository } from '@/modules/shift/domain/repositories/shift.repository'
import { CreateShiftRequest, ShiftModel, UpdateShiftRequest, UpdateShiftDetailsRequest, CancelShiftRequest } from '@/modules/shift/domain/models/shift.model'
import { injectable } from 'inversify'
import { AxiosError } from 'axios'
import 'reflect-metadata'

@injectable()
export class ShiftImplementationRepository implements ShiftRepository {
  async createShift (shift: CreateShiftRequest): Promise<ShiftModel> {
    const response = await axiosApiInterna.post('/api/v1/shifts', shift)
    return response.data
  }

  async updateShift (id: number, shift: UpdateShiftRequest): Promise<ShiftModel> {
    const response = await axiosApiInterna.put(`/api/v1/shifts/${id}`, shift)
    return response.data
  }

  async updateShiftDetails (id: number, details: UpdateShiftDetailsRequest): Promise<ShiftModel> {
    try {
      const response = await axiosApiInterna.put(`/api/v1/shifts/${id}/details`, details)
      return response.data
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const statusCode = error.response.status

        if (statusCode === 409) {
          const backendMessage = error.response.data?.detail || error.response.data?.message || ''

          if (backendMessage.includes('overlaps') || backendMessage.includes('superpone')) {
            throw new Error('Este horario se superpone con otro turno existente. Por favor, verifica los horarios y elige un rango diferente.')
          }

          const errorMessage = backendMessage || 'Ya existe un turno en conflicto con los horarios seleccionados'
          throw new Error(`Conflicto de horarios: ${errorMessage}`)
        }

        if (statusCode === 404) {
          throw new Error('El turno no fue encontrado')
        }

        if (statusCode >= 400 && statusCode < 500) {
          const errorMessage = error.response.data?.message ||
                              error.response.data?.detail ||
                              'Datos inválidos para actualizar el turno'
          throw new Error(errorMessage)
        }

        if (statusCode >= 500) {
          throw new Error('Error interno del servidor. Inténtalo de nuevo más tarde.')
        }
      } else if (error instanceof AxiosError) {
        throw new Error('Error de conexión. Verifica tu conexión a internet.')
      }

      throw new Error('Error inesperado al actualizar el turno')
    }
  }

  async deleteShift (id: number): Promise<void> {
    await axiosApiInterna.delete(`/api/v1/shifts/${id}`)
  }

  async getShiftById (id: number): Promise<ShiftModel> {
    const response = await axiosApiInterna.get(`/api/v1/shifts/${id}`)
    return response.data
  }

  async getShiftsByUser (userId: number): Promise<ShiftModel[]> {
    const response = await axiosApiInterna.get(`/api/v1/shifts/user/${userId}`)
    return response.data
  }

  async getShiftsByLocation (sedeId: number, startDate: string, endDate: string): Promise<ShiftModel[]> {
    const response = await axiosApiInterna.get(`/api/v1/shifts/location/${sedeId}?start_date=${startDate}&end_date=${endDate}`)
    return response.data
  }

  async cancelShift (request: CancelShiftRequest): Promise<ShiftModel> {
    const url = `/api/v1/shifts/${request.shift_id}/delete`
    const response = await axiosApiInterna.delete(url)
    return response.data
  }
}
