import React from 'react';
import { MapPin, Clock, DollarSign, User, Star, Car } from 'lucide-react';
import { RideRequestDto } from '../../types';

interface RideCardProps {
  ride: RideRequestDto;
  showActions?: boolean;
  onAction?: (action: string, rideId: string) => void;
  userRole?: 'RIDER' | 'DRIVER';
}

const RideCard: React.FC<RideCardProps> = ({ ride, showActions = false, onAction, userRole }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Ride #{ride.id.slice(0, 8)}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{formatDateTime(ride.requestedTime)}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ride.rideRequestStatus)}`}>
          {ride.rideRequestStatus}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-1 rounded-full mt-1">
            <MapPin className="h-3 w-3 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Pickup</p>
            <p className="text-sm text-gray-600">
              {ride.pickupLocation.coordinates.join(', ')}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="bg-red-100 p-1 rounded-full mt-1">
            <MapPin className="h-3 w-3 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Drop-off</p>
            <p className="text-sm text-gray-600">
              {ride.dropOffLocation.coordinates.join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">${ride.fare}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Payment:</span>
            <span className="text-sm font-medium text-gray-900">{ride.paymentMethod}</span>
          </div>
        </div>
        
        {ride.driver && (
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{ride.driver.user.name}</p>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{ride.driver.rating}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showActions && onAction && (
        <div className="flex space-x-2">
          {userRole === 'RIDER' && ride.rideRequestStatus === 'PENDING' && (
            <button
              onClick={() => onAction('cancel', ride.id)}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Cancel Ride
            </button>
          )}
          
          {userRole === 'DRIVER' && ride.rideRequestStatus === 'PENDING' && (
            <button
              onClick={() => onAction('accept', ride.id)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Accept Ride
            </button>
          )}
          
          {userRole === 'DRIVER' && ride.rideRequestStatus === 'CONFIRMED' && (
            <button
              onClick={() => onAction('start', ride.id)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Start Ride
            </button>
          )}
          
          {ride.rideRequestStatus === 'COMPLETED' && (
            <button
              onClick={() => onAction('rate', ride.id)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Rate {userRole === 'RIDER' ? 'Driver' : 'Rider'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RideCard;