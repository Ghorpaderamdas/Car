export interface PointDto {
  coordinates: [number, number]; // [longitude, latitude]
  type: string;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  roles: string[]; // This should match backend Role enum values
}

export interface RiderDto {
  user: UserDto;
  rating: number;
}

export interface DriverDto {
  id: number;
  user: UserDto;
  rating: number;
  vehicleId?: string;
  available: boolean;
}

export interface RideRequestDto {
  id: number;
  pickupLocation: PointDto;
  dropOffLocation: PointDto;
  paymentMethod: 'CASH' | 'WALLET';
  fare: number;
  rideRequestStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  rider: RiderDto;
  driver?: DriverDto;
  requestedTime: string;
  otp?: string;
}

export interface RideDto {
  id: number;
  pickupLocation: PointDto;
  dropOffLocation: PointDto;
  createdTime: string;
  rider: RiderDto;
  driver: DriverDto;
  paymentMethod: 'CASH' | 'WALLET';
  rideStatus: 'CANCELLED' | 'CONFIRMED' | 'ENDED' | 'ONGOING';
  otp: string;
  fare: number;
  startedAt?: string;
  endedAt?: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  user?: UserDto;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface PageRideDto {
  content: RideDto[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface RideStartDto {
  otp: string;
}

export interface SignupDto {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  roles: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RideBookingDto {
  pickupLocation: PointDto;
  dropOffLocation: PointDto;
  paymentMethod: 'CASH' | 'WALLET';
}

export interface RatingDto {
  rideId: number;
  rating: number;
  feedback?: string;
}