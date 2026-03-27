import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { NavLink, useNavigate } from "react-router-dom";
import { 
    UserPlus, 
    FilePlus, 
    LogOut, 
    FileText, 
    Search, 
    Download, 
    Filter,
    Users,
    RefreshCw,
    Briefcase
} from "lucide-react";

const API_BASE_URL = 'https://placement-dashboard-u8av.onrender.com/api'; 

// --- 1. Sidebar Component (Exact copy for consistency) ---
function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    console.log("Logging out...");
    navigate("/login");
  }

  return (
    <aside className="w-[20%] max-w-64 min-w-48 h-screen bg-white flex flex-col justify-between border-r border-gray-200 sticky top-0">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <NavLink to={'/college-dashboard'}> 
          <h1 className="text-xl font-bold text-blue-500">Placement</h1>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-6">
        <SidebarItem 
            to="/JobPost" 
            icon={<FilePlus size={20} />} 
            text="Add Job Posting" 
        />
        <SidebarItem 
            to="/AddStudent" 
            icon={<UserPlus size={20} />} 
            text="Add New Student" 
        />
        
        <SidebarItem 
            to="/view-applications" 
            icon={<FileText size={20} />} 
            text="View Applications" 
        />
        <SidebarItem 
    to="/mark-placed" 
    icon={<Briefcase size={20} />} 
    text="Mark Placed" 
/>
        <SidebarItem to="/update-requests" icon={<RefreshCw size={20} />} text="Update Requests" />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center mt-2 px-3 py-2 rounded-lg transition-colors ${
          isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span className="ml-3 font-medium">{text}</span>
    </NavLink>
  );
}


// --- 2. Main Content Component ---

function ViewApplicationsContent() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Fetch Companies for Dropdown
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/companies`);
                setCompanies(res.data);
            } catch (err) {
                console.error("Error fetching companies", err);
            }
        };
        fetchCompanies();
    }, []);

    // Fetch Applicants when Company Changes
    useEffect(() => {
        if (!selectedCompany) {
            setApplicants([]);
            return;
        }

        const fetchApplicants = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/applications/company/${selectedCompany}`);
                // Handle different API response structures safely
                const data = res.data.data || res.data || [];
                setApplicants(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch applicants");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [selectedCompany]);

    // Export to CSV Logic
    const handleExportCSV = () => {
        if (applicants.length === 0) return;

        const headers = ['Student Name', 'Email', 'Phone', 'Branch', 'CGPA', 'Status', 'Applied Date'];
        const rows = applicants.map(app => [
            app.name,
            app.email,
            app.phone || 'N/A',
            app.branch,
            app.cgpa,
            app.status,
            new Date(app.appliedAt).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `applicants_list.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        // Using max-w-6xl here to give the table more room than the form
        <div className="w-full max-w-6xl mx-auto p-6">
            
            {/* Header - Matches AddStudent Header Style */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="mr-3" size={30} />
                View Applications
            </h1>

            {/* Filter Container - Matches AddStudent Card Style */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    
                    {/* Dropdown - Uses same input styling */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Company Drive</label>
                        <div className="relative">
                            <select 
                                className="form-select" // Using your global style class
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                            >
                                <option value="">-- Select a Company --</option>
                                {companies.map((comp) => (
                                    <option key={comp._id} value={comp._id}>
                                        {comp.name} | {comp.jobRoles?.[0] || 'General'} | {new Date(comp.placementDate).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Export Button - Matches Primary Button Style */}
                    <div>
                        <button 
                            onClick={handleExportCSV}
                            disabled={applicants.length === 0}
                            className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-colors ${
                                applicants.length > 0 
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <Download size={18} className="mr-2" />
                            Export List
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Container - Matches AddStudent Card Style */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                         <p>Loading applicants...</p>
                    </div>
                ) : !selectedCompany ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Filter size={48} className="mb-4 opacity-20" />
                        <p className="text-lg">Select a company above to view students.</p>
                    </div>
                ) : applicants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <p className="text-lg">No applications found for this company.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch & Year</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CGPA</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applicants.map((student, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                    {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.branch}</div>
                                            <div className="text-xs text-gray-500">{student.studentId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                {student.cgpa}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {student.resume || student.resumeUrl ? (
                                                <a 
                                                    href={student.resume || student.resumeUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900 hover:underline flex items-center"
                                                >
                                                    View PDF
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${student.status === 'Applied' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                                                  student.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                  student.status === 'Offered' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Global Styles for Consistent Inputs - Exact same block as AddStudent */}
            <style jsx global>{`
                .form-input, .form-textarea, .form-select {
                    width: 100%;
                    padding: 0.65rem 0.75rem;
                    border: 1px solid #D1D5DB; /* border-gray-300 */
                    border-radius: 0.375rem; /* rounded-md */
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
                    transition: border-color 0.2s, box-shadow 0.2s;
                    background-color: white;
                }
                .form-input:focus, .form-textarea:focus, .form-select:focus {
                    outline: none;
                    border-color: #3B82F6; /* focus:border-blue-500 */
                    box-shadow: 0 0 0 2px #BFDBFE; /* focus:ring-blue-200 */
                }
            `}</style>
        </div>
    );
}

// --- 3. Main Page Component (Wrapper) ---
export default function ViewApplications() {
  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <ViewApplicationsContent />
      </main>
    </div>
  );
}