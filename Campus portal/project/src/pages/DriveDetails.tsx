import { useState, useEffect } from 'react';
import {
  Calendar,
  Building2,
  GraduationCap,
  MapPin,
  DollarSign,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { Drive, Page } from '../types';
import { getDriveById } from '../utils/storage';

interface DriveDetailsProps {
  driveId: string;
  onNavigate: (page: Page) => void;
}

export default function DriveDetails({ driveId, onNavigate }: DriveDetailsProps) {
  const [drive, setDrive] = useState<Drive | null>(null);

  useEffect(() => {
    const driveData = getDriveById(driveId);
    if (driveData) {
      setDrive(driveData);
    }
  }, [driveId]);

  if (!drive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Drive not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('drives')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Drives
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{drive.company}</h1>
              <p className="text-xl text-gray-700">{drive.role}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                drive.status === 'Open'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {drive.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <GraduationCap className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Eligible Branches</p>
                  <p className="text-gray-900">{drive.branches.join(', ')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Building2 className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Minimum CGPA</p>
                  <p className="text-gray-900">{drive.minCGPA}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-gray-900">{drive.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <DollarSign className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">CTC</p>
                  <p className="text-gray-900">{drive.ctc}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Drive Date</p>
                  <p className="text-gray-900">
                    {new Date(drive.driveDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Date to Apply</p>
                  <p className="text-gray-900">
                    {new Date(drive.lastDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h2>
            <p className="text-gray-700 leading-relaxed">{drive.description}</p>
          </div>

          {drive.status === 'Open' && (
            <a
              href={drive.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          )}

          {drive.status === 'Closed' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-center">
                Applications for this drive are now closed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
