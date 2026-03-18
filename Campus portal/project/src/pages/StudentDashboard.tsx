import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Calendar } from 'lucide-react';
import { Drive, Page, StudentSubmission } from '../types';
import { getDrives, getSubmissions, addSubmission } from '../utils/storage';

interface StudentDashboardProps {
  onNavigate: (page: Page, driveId?: string) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    branch: 'CSE',
    cgpa: '',
    resumeFile: null as File | null,
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const allDrives = getDrives();
    const openDrives = allDrives.filter((d) => d.status === 'Open');
    setDrives(openDrives);

    const allSubmissions = getSubmissions();
    setSubmissions(allSubmissions);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resumeFile: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submission: StudentSubmission = {
      id: Date.now().toString(),
      name: formData.name,
      branch: formData.branch,
      cgpa: parseFloat(formData.cgpa),
      resumeFileName: formData.resumeFile?.name || 'resume.pdf',
      timestamp: new Date().toISOString(),
    };

    addSubmission(submission);
    setSubmissions([...submissions, submission]);
    setUploadSuccess(true);
    setFormData({ name: '', branch: 'CSE', cgpa: '', resumeFile: null });

    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadForm(false);
    }, 2000);
  };

  const hasSubmitted = submissions.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-700">Open Drives</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{drives.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-700">Resume Status</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {hasSubmitted ? 'Uploaded' : 'Not Uploaded'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-700">Your Submissions</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Resume Upload</h2>
            {!showUploadForm && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </button>
            )}
          </div>

          {uploadSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Resume uploaded successfully!
              </p>
            </div>
          )}

          {showUploadForm && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    <option value="CSE">Computer Science Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical Engineering</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {!showUploadForm && hasSubmitted && (
            <div className="space-y-4">
              <p className="text-gray-600">Your resume submissions:</p>
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{sub.name}</p>
                    <p className="text-sm text-gray-600">
                      {sub.branch} | CGPA: {sub.cgpa} | {sub.resumeFileName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(sub.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Eligible Open Drives</h2>

          {drives.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No open drives available at the moment</p>
          ) : (
            <div className="space-y-4">
              {drives.map((drive) => (
                <div
                  key={drive.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{drive.company}</h3>
                    <p className="text-gray-600">{drive.role}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Min CGPA: {drive.minCGPA} | Drive Date:{' '}
                      {new Date(drive.driveDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('drive-details', drive.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
