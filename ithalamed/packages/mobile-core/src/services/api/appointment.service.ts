import { getApiClient } from './client';
import { ENDPOINTS } from '../../config/api.config';

// Import types from shared-types
import {
  Appointment,
  AppointmentSlot,
  BookAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  CheckInRequest,
  AppointmentStatus,
  PaginatedResponse,
  PaginationParams,
  CheckInMethod,
  Provider,
  Facility,
} from '@ithalamed/shared-types';

export class AppointmentService {
  async getAppointments(
    params?: PaginationParams & {
      status?: AppointmentStatus;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<PaginatedResponse<Appointment>> {
    const apiClient = getApiClient();
    return apiClient. get<PaginatedResponse<Appointment>>(ENDPOINTS.appointments. list, params);
  }

  async getUpcomingAppointments(limit?: number): Promise<Appointment[]> {
    const apiClient = getApiClient();
    return apiClient.get<Appointment[]>(ENDPOINTS.appointments.upcoming, { limit });
  }

  async getPastAppointments(params?: PaginationParams): Promise<PaginatedResponse<Appointment>> {
    const apiClient = getApiClient();
    return apiClient. get<PaginatedResponse<Appointment>>(ENDPOINTS.appointments. past, params);
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const apiClient = getApiClient();
    return apiClient.get<Appointment[]>(ENDPOINTS. appointments.today);
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const apiClient = getApiClient();
    return apiClient.get<Appointment>(ENDPOINTS.appointments.byId(id));
  }

  async bookAppointment(request: BookAppointmentRequest): Promise<Appointment> {
    const apiClient = getApiClient();
    return apiClient.post<Appointment>(ENDPOINTS.appointments.book, request);
  }

  async cancelAppointment(id: string, request: CancelAppointmentRequest): Promise<Appointment> {
    const apiClient = getApiClient();
    return apiClient.post<Appointment>(ENDPOINTS.appointments. cancel(id), request);
  }

  async rescheduleAppointment(id: string, request: RescheduleAppointmentRequest): Promise<Appointment> {
    const apiClient = getApiClient();
    return apiClient. post<Appointment>(ENDPOINTS. appointments.reschedule(id), request);
  }

  async checkIn(
    id: string,
    method: CheckInMethod = CheckInMethod.MOBILE_APP,
    location?:  { latitude: number; longitude: number },
  ): Promise<Appointment> {
    const apiClient = getApiClient();
    return apiClient. post<Appointment>(ENDPOINTS. appointments.checkIn(id), { method, location });
  }

  async confirmAppointment(id: string): Promise<Appointment> {
    const apiClient = getApiClient();
    return apiClient.post<Appointment>(ENDPOINTS.appointments.confirm(id));
  }

  async searchProviders(params?: {
    query?: string;
    specialization?: string;
    facilityId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Provider>> {
    const apiClient = getApiClient();
    return apiClient.get<PaginatedResponse<Provider>>(ENDPOINTS.providers.search, params);
  }

  async getProviderById(id: string): Promise<Provider> {
    const apiClient = getApiClient();
    return apiClient.get<Provider>(ENDPOINTS.providers.byId(id));
  }

  async getProviderAvailability(
    providerId: string,
    date: string,
    facilityId?:  string,
  ): Promise<AppointmentSlot[]> {
    const apiClient = getApiClient();
    return apiClient.get<AppointmentSlot[]>(ENDPOINTS.providers.availability(providerId), {
      date,
      facilityId,
    });
  }

  async getProviderSlots(
    providerId: string,
    params:  {
      startDate:  string;
      endDate: string;
      facilityId?: string;
      duration?: number;
    },
  ): Promise<AppointmentSlot[]> {
    const apiClient = getApiClient();
    return apiClient.get<AppointmentSlot[]>(ENDPOINTS.providers.slots(providerId), params);
  }

  async searchFacilities(params?: {
    query?: string;
    type?: string;
    city?: string;
    province?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Facility>> {
    const apiClient = getApiClient();
    return apiClient.get<PaginatedResponse<Facility>>(ENDPOINTS.facilities.search, params);
  }

  async getFacilityById(id:  string): Promise<Facility> {
    const apiClient = getApiClient();
    return apiClient. get<Facility>(ENDPOINTS. facilities.byId(id));
  }

  async getNearbyFacilities(
    latitude: number,
    longitude: number,
    radiusKm?:  number,
    type?: string,
  ): Promise<Facility[]> {
    const apiClient = getApiClient();
    return apiClient.get<Facility[]>(ENDPOINTS.facilities.nearby, {
      latitude,
      longitude,
      radius: radiusKm,
      type,
    });
  }
}

let appointmentServiceInstance:  AppointmentService | null = null;

export function getAppointmentService(): AppointmentService {
  if (!appointmentServiceInstance) {
    appointmentServiceInstance = new AppointmentService();
  }
  return appointmentServiceInstance;
}
