import { api } from './client';
import { ENDPOINTS } from '../../config/api.config';

// Import types from shared-types
import {
  Appointment,
  AppointmentSlot,
  BookAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  AppointmentStatus,
  PaginatedResponse,
  PaginationParams,
  CheckInMethod,
  Provider,
  Facility,
} from '@ithalamed/shared-types';

export const appointmentService = {
  async getAppointments(
    params?:  PaginationParams & {
      status?: AppointmentStatus;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<PaginatedResponse<Appointment>> {
    return api.get<PaginatedResponse<Appointment>>(ENDPOINTS.appointments.list, params);
  },

  async getUpcomingAppointments(limit?:  number): Promise<Appointment[]> {
    return api.get<Appointment[]>(ENDPOINTS.appointments.upcoming, { limit });
  },

  async getPastAppointments(params?: PaginationParams): Promise<PaginatedResponse<Appointment>> {
    return api. get<PaginatedResponse<Appointment>>(ENDPOINTS.appointments. past, params);
  },

  async getTodayAppointments(): Promise<Appointment[]> {
    return api.get<Appointment[]>(ENDPOINTS.appointments.today);
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    return api.get<Appointment>(ENDPOINTS.appointments.byId(id));
  },

  async bookAppointment(request: BookAppointmentRequest): Promise<Appointment> {
    return api.post<Appointment>(ENDPOINTS.appointments.book, request);
  },

  async cancelAppointment(id: string, request: CancelAppointmentRequest): Promise<Appointment> {
    return api.post<Appointment>(ENDPOINTS.appointments.cancel(id), request);
  },

  async rescheduleAppointment(
    id: string,
    request: RescheduleAppointmentRequest,
  ): Promise<Appointment> {
    return api.post<Appointment>(ENDPOINTS.appointments.reschedule(id), request);
  },

  async checkIn(id: string, method: CheckInMethod = CheckInMethod.MANUAL): Promise<Appointment> {
    return api.post<Appointment>(ENDPOINTS.appointments.checkIn(id), { method });
  },

  async confirmAppointment(id: string): Promise<Appointment> {
    return api.post<Appointment>(ENDPOINTS.appointments.confirm(id));
  },

  // Providers
  async searchProviders(params?:  {
    query?: string;
    specialization?: string;
    facilityId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Provider>> {
    return api.get<PaginatedResponse<Provider>>(ENDPOINTS.providers.search, params);
  },

  async getProviderById(id: string): Promise<Provider> {
    return api. get<Provider>(ENDPOINTS.providers.byId(id));
  },

  async getProviderAvailability(
    providerId: string,
    date: string,
    facilityId?: string,
  ): Promise<AppointmentSlot[]> {
    return api.get<AppointmentSlot[]>(ENDPOINTS.providers.availability(providerId), {
      date,
      facilityId,
    });
  },

  // Facilities
  async searchFacilities(params?: {
    query?: string;
    type?: string;
    city?: string;
    province?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Facility>> {
    return api.get<PaginatedResponse<Facility>>(ENDPOINTS.facilities.search, params);
  },

  async getFacilityById(id: string): Promise<Facility> {
    return api.get<Facility>(ENDPOINTS.facilities.byId(id));
  },

  async getNearbyFacilities(
    latitude: number,
    longitude: number,
    radiusKm?:  number,
    type?: string,
  ): Promise<Facility[]> {
    return api.get<Facility[]>(ENDPOINTS.facilities.nearby, {
      latitude,
      longitude,
      radius: radiusKm,
      type,
    });
  },
};
