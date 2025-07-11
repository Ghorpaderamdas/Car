import axios from 'axios';
import {
  LoginDto,
  SignupDto,
  LoginResponseDto,
  UserDto,
  RideRequestDto,
  PageRideDto,
  RideStartDto,
  RatingDto,
  RideBookingDto,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// 🔐 Attach access token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔗 API Request:', config.method?.toUpperCase(), config.url, config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Handle 401 + try refresh
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post<LoginResponseDto>(`${API_BASE_URL}/api/auth/refresh`, {}, {
          withCredentials: true
        });

        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// 🔐 Auth API
export const authAPI = {
  login: (data: LoginDto) => api.post<LoginResponseDto>('/api/auth/login', data),
  signup: (data: SignupDto) => api.post<UserDto>('/api/auth/signup', data),
  getRoles: () => api.get<string[]>('/api/auth/roles'),
  onBoardDriver: (userId: string, vehicleId: string) =>
    api.post(`/api/auth/onBoardNewDriver/${userId}`, { vehicleId }),
  refresh: () => api.post<LoginResponseDto>('/api/auth/refresh'),
  getUserByEmail: (email: string) => api.get<UserDto>(`/api/auth/user?email=${encodeURIComponent(email)}`),
};

// 🧍 Rider API
export const riderAPI = {
  requestRide: (data: RideBookingDto) => api.post<RideRequestDto>('/api/riders/requestRide', data),
  getMyRides: (page = 0, size = 10) =>
    api.get<PageRideDto>(`/api/riders/getMyRides?pageOffset=${page}&pageSize=${size}`),
  getMyProfile: () => api.get<UserDto>('/api/riders/getMyProfile'),
  rateDriver: (rideId: string, rating: number) =>
    api.post(`/api/riders/rateDriver`, { rideId, rating }),
  cancelRide: (rideId: string) => api.post(`/api/riders/cancelRide/${rideId}`),
};

// 🚗 Driver API
export const driverAPI = {
  acceptRide: (rideRequestId: string) => api.post(`/api/drivers/acceptRide/${rideRequestId}`),
  startRide: (rideRequestId: string, data: RideStartDto) =>
    api.post(`/api/drivers/startRide/${rideRequestId}`, data),
  endRide: (rideId: string) => api.post(`/api/drivers/endRide/${rideId}`),
  cancelRide: (rideId: string) => api.post(`/api/drivers/cancelRide/${rideId}`),
  rateRider: (rideId: string, rating: number) =>
    api.post(`/api/drivers/rateRider`, { rideId, rating }),
  getMyRides: (page = 0, size = 10) =>
    api.get<PageRideDto>(`/api/drivers/getMyRides?pageOffset=${page}&pageSize=${size}`),
  getMyProfile: () => api.get<UserDto>('/api/drivers/getMyProfile'),
  getAvailableRides: () => api.get<RideRequestDto[]>('/api/drivers/availableRides'),
};

export default api;