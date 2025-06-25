
import React from 'react';
import { Button } from './common/Button';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../constants';

interface SensorDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensorData: {
    id: string;
    name: string;
    moisture: number;
    status: string;
  } | null;
}

export const SensorDataModal: React.FC<SensorDataModalProps> = ({ isOpen, onClose, sensorData }) => {
  if (!isOpen || !sensorData) return null;

  let statusColor = 'text-green-600 dark:text-green-400'; // Optimal
  if (sensorData.status === 'Dry') {
    statusColor = 'text-yellow-600 dark:text-yellow-400';
  } else if (sensorData.status === 'Overwatered') {
    statusColor = 'text-red-600 dark:text-red-400';
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-[100]"
        onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <div 
            className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: SECONDARY_COLOR, color: PRIMARY_COLOR, margin: "-24px -24px 16px -24px", padding: "16px 24px", borderRadius: "8px 8px 0 0"}}
        >
          <h3 className="text-xl font-semibold">Sensor Data: {sensorData.name}</h3>
          <button onClick={onClose} className="text-primary hover:text-yellow-300" aria-label="Close sensor data modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Sensor Name:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{sensorData.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Simulated Moisture Level:</span>
            <span className="ml-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{sensorData.moisture}%</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <span className={`ml-2 font-semibold ${statusColor}`}>{sensorData.status}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
          <Button onClick={onClose} variant="primary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
