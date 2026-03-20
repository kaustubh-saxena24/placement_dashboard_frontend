import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Icons (as inline SVGs) ---

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18"></line>
    <line x1="6" x2="18" y1="6" y2="18"></line>
  </svg>
);

// --- Main Search Page Component ---

export default function SearchPage() {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch all students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/students');
        setAllStudents(response.data);
        setFilteredStudents(response.data); // Show all by default
      } catch (err) {
        setError('Failed to fetch students. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // 2. Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term === '') {
      setFilteredStudents(allStudents); 
    } else {
      const filtered = allStudents.filter((student) =>
        student.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-white-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by student name..."
            className="w-full h-14 pl-12 pr-6 py-4 text-lg bg-white rounded-xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading && <p className="p-6 text-center text-gray-500">Loading students...</p>}
          {error && <p className="p-6 text-center text-red-500">{error}</p>}
          
          {!loading && !error && (
            <ul className="divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <li key={student._id}>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors duration-200 text-left"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <UserIcon />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.studentId} - {student.branch}</p>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <p className="p-6 text-center text-gray-500">No students found matching your search.</p>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
}

// --- Student Detail Modal Component ---

const StudentDetailModal = ({ student, onClose }) => {
  
  // Helper to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-green-100 text-green-800';
      case 'Not Placed': return 'bg-red-100 text-red-800';
      case 'Interviewing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white-200">
          <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
          <p className="text-md text-gray-500">{student.studentId}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Email" value={student.email} />
            <InfoItem label="Phone" value={student.phone} />
            <InfoItem label="Branch" value={student.branch} />
            <InfoItem label="CGPA" value={student.cgpa} />
            <InfoItem label="Year" value={student.currentYear} />
            <InfoItem label="Backlogs" value={student.activeBacklogs} />
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">Placement Status:</span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(student.status)}`}>
              {student.status}
            </span>
          </div>

          {student.resumeUrl && (
            <a
              href={student.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Resume
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Info Item Helper Component ---

const InfoItem = ({ label, value }) => (
  <div className="text-sm">
    <p className="font-medium text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
  </div>
);
