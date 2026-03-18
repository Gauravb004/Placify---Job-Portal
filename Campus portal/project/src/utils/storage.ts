import { Drive, StudentSubmission } from '../types';

const DRIVES_KEY = 'placify_drives';
const SUBMISSIONS_KEY = 'placify_submissions';

export const initializeStorage = () => {
  if (!localStorage.getItem(DRIVES_KEY)) {
    const sampleDrives: Drive[] = [
      {
        id: '1',
        company: 'Google',
        role: 'Software Engineer',
        branches: ['CSE', 'IT', 'ECE'],
        minCGPA: 8.5,
        driveDate: '2026-02-15',
        lastDate: '2026-02-10',
        applyLink: 'https://forms.google.com/sample',
        status: 'Open',
        description: 'Looking for talented software engineers to join our team. Strong coding skills required.',
        location: 'Bangalore',
        ctc: '₹25 LPA',
      },
      {
        id: '2',
        company: 'Microsoft',
        role: 'Full Stack Developer',
        branches: ['CSE', 'IT'],
        minCGPA: 8.0,
        driveDate: '2026-02-20',
        lastDate: '2026-02-15',
        applyLink: 'https://forms.google.com/sample',
        status: 'Open',
        description: 'Seeking full stack developers proficient in modern web technologies.',
        location: 'Hyderabad',
        ctc: '₹22 LPA',
      },
      {
        id: '3',
        company: 'Amazon',
        role: 'SDE Intern',
        branches: ['CSE', 'IT', 'ECE', 'EEE'],
        minCGPA: 7.5,
        driveDate: '2026-01-20',
        lastDate: '2026-01-15',
        applyLink: 'https://forms.google.com/sample',
        status: 'Closed',
        description: 'Summer internship program for aspiring software developers.',
        location: 'Chennai',
        ctc: '₹50k/month',
      },
    ];
    localStorage.setItem(DRIVES_KEY, JSON.stringify(sampleDrives));
  }

  if (!localStorage.getItem(SUBMISSIONS_KEY)) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
  }
};

export const getDrives = (): Drive[] => {
  const drives = localStorage.getItem(DRIVES_KEY);
  return drives ? JSON.parse(drives) : [];
};

export const saveDrives = (drives: Drive[]) => {
  localStorage.setItem(DRIVES_KEY, JSON.stringify(drives));
};

export const getDriveById = (id: string): Drive | undefined => {
  const drives = getDrives();
  return drives.find((d) => d.id === id);
};

export const addDrive = (drive: Drive) => {
  const drives = getDrives();
  drives.push(drive);
  saveDrives(drives);
};

export const updateDrive = (id: string, updatedDrive: Drive) => {
  const drives = getDrives();
  const index = drives.findIndex((d) => d.id === id);
  if (index !== -1) {
    drives[index] = updatedDrive;
    saveDrives(drives);
  }
};

export const deleteDrive = (id: string) => {
  const drives = getDrives();
  const filtered = drives.filter((d) => d.id !== id);
  saveDrives(filtered);
};

export const getSubmissions = (): StudentSubmission[] => {
  const submissions = localStorage.getItem(SUBMISSIONS_KEY);
  return submissions ? JSON.parse(submissions) : [];
};

export const addSubmission = (submission: StudentSubmission) => {
  const submissions = getSubmissions();
  submissions.push(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
};

export const updateDriveStatuses = () => {
  const drives = getDrives();
  const today = new Date().toISOString().split('T')[0];

  const updated = drives.map((drive) => {
    if (drive.lastDate < today && drive.status === 'Open') {
      return { ...drive, status: 'Closed' as const };
    }
    return drive;
  });

  saveDrives(updated);
};
