import { Briefcase, Users, Bell } from 'lucide-react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}
export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            PLACIFY
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Campus Drive  Portal
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            The Problem
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
           Say goodbye to the chaos of cluttered WhatsApp groups and missed notifications. PLACIFY streamlines the campus recruitment process by organizing all drive information into one intuitive dashboard. We empower students with clear, accessible data on eligibility and deadlines, making the journey from campus to corporate seamless and efficient.
          </p>
        
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-4">
              <Briefcase className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Centralized Information
            </h3>
            <p className="text-gray-600 text-sm">
              All campus drives in one place with complete details and eligibility criteria
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-4">
              <Bell className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Never Miss a Drive
            </h3>
            <p className="text-gray-600 text-sm">
              Clear timelines, deadlines, and automatic status updates
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Easy Management
            </h3>
            <p className="text-gray-600 text-sm">
              Placement cells can manage drives and track student applications efficiently
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => onNavigate('drives')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Campus Drives
          </button>
          <button
            onClick={() => onNavigate('student-login')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Student Login
          </button>
          <button
            onClick={() => onNavigate('admin-login')}
            className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
