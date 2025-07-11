import React, { useState, useEffect } from 'react';
import { riderAPI } from '../../services/api';
import { RideRequestDto } from '../../types';
import RideCard from '../../components/common/RideCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const RiderRides: React.FC = () => {
  const [rides, setRides] = useState<RideRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchRides();
  }, [currentPage]);

  const fetchRides = async () => {
    try {
      setIsLoading(true);
      const response = await riderAPI.getMyRides(currentPage, 10);
      setRides(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch rides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRideAction = async (action: string, rideId: string) => {
    try {
      switch (action) {
        case 'cancel':
          await riderAPI.cancelRide(rideId);
          toast.success('Ride cancelled successfully');
          fetchRides();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rides</h1>
        <p className="text-gray-600">View and manage your ride history</p>
      </div>

      {rides.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rides yet</h3>
          <p className="text-gray-600">Book your first ride to see it here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              showActions={true}
              onAction={handleRideAction}
              userRole="RIDER"
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === i
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default RiderRides;