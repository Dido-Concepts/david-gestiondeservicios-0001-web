import { CreateDaysOffRequest, DaysOffModel, DayOffTypesResponse, GetDayOffTypesParams, UpdateDaysOffDetailsRequest } from '@/modules/days-off/domain/models/days-off.model'

export abstract class DaysOffRepository {
  abstract createDayOff(dayOff: CreateDaysOffRequest): Promise<number>
  abstract getDaysOffByUser(userId: number): Promise<DaysOffModel[]>
  abstract updateDayOff(id: number, dayOff: Partial<CreateDaysOffRequest>): Promise<string>
  abstract deleteDayOff(id: number): Promise<string>
  abstract getDayOffTypes(params: GetDayOffTypesParams): Promise<DayOffTypesResponse>
  abstract updateDayOffDetails(dayOffId: number, details: UpdateDaysOffDetailsRequest): Promise<string>
}
