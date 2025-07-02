import { CreateShiftRequest, ShiftModel, UpdateShiftRequest, UpdateShiftDetailsRequest, CancelShiftRequest } from '@/modules/shift/domain/models/shift.model'

export abstract class ShiftRepository {
  abstract createShift(shift: CreateShiftRequest): Promise<ShiftModel>
  abstract updateShift(id: number, shift: UpdateShiftRequest): Promise<ShiftModel>
  abstract updateShiftDetails(id: number, details: UpdateShiftDetailsRequest): Promise<ShiftModel>
  abstract deleteShift(id: number): Promise<void>
  abstract cancelShift(request: CancelShiftRequest): Promise<ShiftModel>
  abstract getShiftById(id: number): Promise<ShiftModel>
  abstract getShiftsByUser(userId: number): Promise<ShiftModel[]>
  abstract getShiftsByLocation(sedeId: number, startDate: string, endDate: string): Promise<ShiftModel[]>
}
