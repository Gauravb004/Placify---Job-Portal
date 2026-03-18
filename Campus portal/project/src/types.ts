export interface Drive {
  id: string;
  company: string;
  role: string;
  branches: string[];
  minCGPA: number;
  driveDate: string;
  lastDate: string;
  applyLink: string;
  status: 'Open' | 'Closed';
  description: string;
  location: string;
  ctc: string;
}

export interface StudentSubmission {
  id: string;
  name: string;
  branch: string;
  cgpa: number;
  resumeFileName: string;
  timestamp: string;
}

export type Page =
  | 'home'
  | 'drives'
  | 'drive-details'
  | 'student-login'
  | 'admin-login'
  | 'student-dashboard'
  | 'admin-dashboard'
  | 'admin-resumes';
