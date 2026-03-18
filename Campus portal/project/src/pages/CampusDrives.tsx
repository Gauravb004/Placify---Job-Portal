import { useState, useEffect } from 'react';
import { Search, Calendar, Building2, GraduationCap } from 'lucide-react';
import { Drive, Page } from '../types';
import { getDrives } from '../utils/storage';

interface CampusDrivesProps {
  onNavigate: (page: Page, driveId?: string) => void;
}

export default function CampusDrives({ onNavigate }: CampusDrivesProps) {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [cgpaFilter, setCgpaFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const allDrives = getDrives();
    setDrives(allDrives);
  }, []);

  const allBranches = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch = drive.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'All' || drive.branches.includes(branchFilter);
    const matchesCGPA = cgpaFilter === 'All' ||
                       (cgpaFilter === '7+' && drive.minCGPA >= 7) ||
                       (cgpaFilter === '8+' && drive.minCGPA >= 8) ||
                       (cgpaFilter === '9+' && drive.minCGPA >= 9);
    const matchesStatus = statusFilter === 'All' || drive.status === statusFilter;

    return matchesSearch && matchesBranch && matchesCGPA && matchesStatus;
  });

  const upcomingDrives = filteredDrives.filter((d) => d.status === 'Open');
  const pastDrives = filteredDrives.filter((d) => d.status === 'Closed');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Campus Drives</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Company
              </label>
              <input
                type="text"
                placeholder="Search by company or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                {allBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min CGPA</label>
              <select
                value={cgpaFilter}
                onChange={(e) => setCgpaFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                <option value="All">All</option>
                <option value="7+">7.0+</option>
                <option value="8+">8.0+</option>
                <option value="9+">9.0+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                <option value="All">All</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {upcomingDrives.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Drives</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingDrives.map((drive) => (
                <DriveCard key={drive.id} drive={drive} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {pastDrives.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Past Drives</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastDrives.map((drive) => (
                <DriveCard key={drive.id} drive={drive} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {filteredDrives.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No drives found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DriveCard({ drive, onNavigate }: { drive: Drive; onNavigate: (page: Page, driveId?: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{drive.company}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              drive.status === 'Open'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {drive.status}
          </span>
        </div>

        <p className="text-gray-700 font-medium mb-4">{drive.role}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span>{drive.branches.join(', ')}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-2" />
            <span>Min CGPA: {drive.minCGPA}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Drive Date: {new Date(drive.driveDate).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('drive-details', drive.id)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
