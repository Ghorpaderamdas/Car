import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, DollarSign, MapPin, CreditCard, Wallet } from 'lucide-react';
import { riderAPI } from '../../services/api';
import { PointDto, RideBookingDto } from '../../types';
import LocationPicker from '../../components/common/LocationPicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const RiderDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState<PointDto>({ coordinates: [0, 0], type: 'Point' });
  const [dropoffCoords, setDropoffCoords] = useState<PointDto>({ coordinates: [0, 0], type: 'Point' });
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'WALLET'>('CASH');
  const [estimatedFare, setEstimatedFare] = useState(0);
  
  const navigate = useNavigate();

  const handlePickupChange = (location: string, coordinates: PointDto) => {
    setPickupLocation(location);
    setPickupCoords(coordinates);
    calculateFare();
  };

  const handleDropoffChange = (location: string, coordinates: PointDto) => {
    setDropoffLocation(location);
    setDropoffCoords(coordinates);
    calculateFare();
  };

  const calculateFare = () => {
    // Mock fare calculation - in real app, use actual distance calculation
    if (pickupLocation && dropoffLocation) {
      const baseFare = 5;
      const distanceFare = Math.random() * 20 + 5; // Mock distance-based fare
      setEstimatedFare(Math.round((baseFare + distanceFare) * 100) / 100);
    }
  };

  const handleBookRide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLocation || !dropoffLocation) {
      toast.error('Please select both pickup and drop-off locations');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const rideData: RideBookingDto = {
        pickupLocation: pickupCoords,
        dropOffLocation: dropoffCoords,
        paymentMethod,
      };
      
      const response = await riderAPI.requestRide(rideData);
      toast.success('Ride requested successfully!');
      
      // Navigate to rides page to see the status
      navigate('/rider/rides');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book ride');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Ride</h1>
        <p className="text-gray-600">Where would you like to go?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleBookRide} className="space-y-6">
              <LocationPicker
                label="Pickup Location"
                value={pickupLocation}
                onChange={handlePickupChange}
                placeholder="Enter pickup location"
                required
              />
              
              <LocationPicker
                label="Drop-off Location"
                value={dropoffLocation}
                onChange={handleDropoffChange}
                placeholder="Enter drop-off location"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'CASH'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <DollarSign className="h-5 w-5" />
                    <span className="font-medium">Cash</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'WALLET'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    <span className="font-medium">Wallet</span>
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !pickupLocation || !dropoffLocation}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Booking Ride...
                  </>
                ) : (
                  <>
                    <Car className="h-5 w-5 mr-2" />
                    Book Ride
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ride Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Pickup</p>
                  <p className="text-sm text-gray-600">
                    {pickupLocation || 'Not selected'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Drop-off</p>
                  <p className="text-sm text-gray-600">
                    {dropoffLocation || 'Not selected'}
                  </p>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Payment Method</span>
                <div className="flex items-center space-x-1">
                  {paymentMethod === 'CASH' ? (
                    <DollarSign className="h-4 w-4 text-green-600" />
                  ) : (
                    <Wallet className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="text-sm text-gray-600">{paymentMethod}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Estimated Fare</span>
                <span className="text-lg font-bold text-gray-900">
                  {estimatedFare > 0 ? `$${estimatedFare}` : '--'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;