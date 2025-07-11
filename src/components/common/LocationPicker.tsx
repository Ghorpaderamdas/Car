import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { PointDto } from '../../types';

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (location: string, coordinates: PointDto) => void;
  placeholder?: string;
  required?: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter location',
  required = false
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock location suggestions - in real app, integrate with Google Maps API
  const mockSuggestions = [
    'Times Square, New York, NY',
    'Central Park, New York, NY',
    'Brooklyn Bridge, New York, NY',
    'Empire State Building, New York, NY',
    'Statue of Liberty, New York, NY',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue, { coordinates: [0, 0], type: 'Point' });
    
    if (inputValue.length > 2) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Mock coordinates - in real app, get actual coordinates from geocoding
    const mockCoordinates: PointDto = {
      coordinates: [-73.9857, 40.7484], // NYC coordinates
      type: 'Point'
    };
    
    onChange(suggestion, mockCoordinates);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                <span className="font-normal block truncate">{suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;