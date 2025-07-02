export interface UserLocationEvent {
  user_id: number;
  user_name: string;
  email: string;
  event_type: string;
  event_id: number;
  event_start_time: string;
  event_end_time: string;
  event_description: string;
  event_sede_id: number;
}

export interface AssignUserToLocationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export abstract class UserLocationRepository {
  abstract getUserLocationEvents(params: {
    sedeId: string;
    startDate: string;
    endDate: string;
  }): Promise<UserLocationEvent[]>;

  abstract assignUserToLocation(params: {
    sedeId: number;
    userId: number;
  }): Promise<AssignUserToLocationResponse>;

  abstract deactivateUserFromLocation(params: {
    sedeId: number;
    userId: number;
  }): Promise<AssignUserToLocationResponse>;
}
