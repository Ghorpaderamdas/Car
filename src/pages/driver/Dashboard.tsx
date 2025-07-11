import React, { useState, useEffect } from 'react';
import { driverAPI } from '../../services/api';
import { RideRequestDto } from '../../types';
import RideCard from '../../components/common/RideCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Car, Clock, DollarSign, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const DriverDashboard: React.FC = () => {
  const [availableRides, setAvailableRides] = useState<RideRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [otpModal, setOtpModal] = useState<{ isOpen: boolean; rideId: string }>({
    isOpen: false,
    rideId: ''
  });
  const [otp, setOtp] = useState('');

  useEffect(() => {
    fetchAvailableRides();
    // Set up polling for new rides
    const interval = setInterval(fetchAvailableRides, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAvailableRides = async () => {
    try {
      setIsLoading(true);
      const response = await driverAPI.getAvailableRides();
      // Filter only pending rides
      const pendingRides = response.data.filter(ride => ride.rideRequestStatus === 'PENDING');
      setAvailableRides(pendingRides);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch available rides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRideAction = async (action: string, rideId: string) => {
    try {
      switch (action) {
        case 'accept':
          await driverAPI.acceptRide(rideId);
          toast.success('Ride accepted successfully');
          fetchAvailableRides();
          break;
        case 'start':
          setOtpModal({ isOpen: true, rideId });
          break;
        case 'end':
          await driverAPI.endRide(rideId);
          toast.success('Ride completed successfully');
          fetchAvailableRides();
          break;
        case 'cancel':
          await driverAPI.cancelRide(rideId);
          toast.success('Ride cancelled successfully');
          fetchAvailableRides();
          break;
        case 'rate':
          // TODO: Implement rating modal
          toast.info('Rating feature coming soon!');
          break;
        default:
          break;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleStartRide = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      await driverAPI.startRide(otpModal.rideId, { otp });
      toast.success('Ride started successfully');
      setOtpModal({ isOpen: false, rideId: '' });
      setOtp('');
      fetchAvailableRides();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const closeOtpModal = () => {
    setOtpModal({ isOpen: false, rideId: '' });
    setOtp('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
        <p className="text-gray-600">Manage your rides and earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Rides</p>
              <p className="text-2xl font-bold text-gray-900">{availableRides.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">$0.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Online</p>
              <p className="text-2xl font-bold text-gray-900">0h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rides */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Rides</h2>
        
        {availableRides.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides available</h3>
            <p className="text-gray-600">Check back later for new ride requests!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {availableRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                showActions={true}
                onAction={handleRideAction}
                userRole="DRIVER"
              />
            ))}
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {otpModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter OTP to Start Ride</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please ask the rider for the OTP to start the ride.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleStartRide}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Ride
              </button>
              <button
                onClick={closeOtpModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;