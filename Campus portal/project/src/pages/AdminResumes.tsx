import { useState, useEffect } from 'react';
import { FileText, Filter, ArrowUpDown } from 'lucide-react';
import { StudentSubmission } from '../types';
import { getSubmissions } from '../utils/storage';

export default function AdminResumes() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [branchFilter, setBranchFilter] = useState('All');
  const [cgpaFilter, setCgpaFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const allSubmissions = getSubmissions();
    setSubmissions(allSubmissions);
  }, []);

  const allBranches = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

  const filteredSubmissions = submissions
    .filter((sub) => {
      const matchesBranch = branchFilter === 'All' || sub.branch === branchFilter;
      const matchesCGPA =
        cgpaFilter === 'All' ||
        (cgpaFilter === '7+' && sub.cgpa >= 7) ||
        (cgpaFilter === '8+' && sub.cgpa >= 8) ||
        (cgpaFilter === '9+' && sub.cgpa >= 9);

      return matchesBranch && matchesCGPA;
    })
    .sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.cgpa - a.cgpa;
      }
      return a.cgpa - b.cgpa;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Resume Management</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by CGPA</label>
              <button
                onClick={toggleSortOrder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span>{sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}</span>
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Student Submissions ({filteredSubmissions.length})
            </h2>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No submissions found matching your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Resume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Submitted On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {submission.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{submission.branch}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            submission.cgpa >= 9
                              ? 'bg-green-100 text-green-800'
                              : submission.cgpa >= 8
                              ? 'bg-blue-100 text-blue-800'
                              : submission.cgpa >= 7
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {submission.cgpa.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          {submission.resumeFileName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(submission.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">CGPA 9.0+</p>
              <p className="text-2xl font-bold text-green-600">
                {submissions.filter((s) => s.cgpa >= 9).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">CGPA 8.0-8.9</p>
              <p className="text-2xl font-bold text-blue-600">
                {submissions.filter((s) => s.cgpa >= 8 && s.cgpa < 9).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">CGPA Below 8.0</p>
              <p className="text-2xl font-bold text-gray-600">
                {submissions.filter((s) => s.cgpa < 8).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
