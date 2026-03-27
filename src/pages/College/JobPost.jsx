import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";

import { UserPlus, FilePlus, LogOut, Send, FileText,RefreshCw ,Briefcase} from "lucide-react";

const API_BASE_URL = 'https://placement-dashboard-u8av.onrender.com/api'; 

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



function PostJobForm() {
    const navigate = useNavigate();
    const initialState = {
        name: '',
        website: '',
        industry: '',
        description: '',
        location: '',
        placementDate: '',
        placementStatus: 'Not Scheduled',
        jobRoles: '', 
        packageOffered: '',
        eligibilityCriteria: '',
        placementType: 'On-Campus',
        contactPerson: '',
        contactEmail: '',
        contactPhone: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
           
            const jobRolesArray = formData.jobRoles
                .split(',')
                .map(role => role.trim())
                .filter(role => role.length > 0); 

            
            const payload = {
                ...formData,
                jobRoles: jobRolesArray,
                
                placementDate: formData.placementDate || null,
            };

            
            const response = await axios.post(`${API_BASE_URL}/companies`, payload);

            setSuccess(true);
            setFormData(initialState); 
            setTimeout(() => {
                navigate('/college-dashboard'); 
            }, 2000);

        } catch (err) {
            console.error("Error posting job:", err);
            // Handle unique name error
            if (err.response && err.response.data && err.response.data.message && err.response.data.message.includes('duplicate key')) {
                setError('A company with this name already exists.');
            } else {
                setError(err.response?.data?.message || 'Failed to post job. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FilePlus className="mr-3" size={30} />
                Post a New Job Opportunity
            </h1>

            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="form-input" />
                    </div>

                    {/* Website */}
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input type="url" name="website" id="website" value={formData.website} onChange={handleChange} placeholder="https://company.com" className="form-input" />
                    </div>

                    {/* Industry */}
                    <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        <input type="text" name="industry" id="industry" value={formData.industry} onChange={handleChange} placeholder="e.g., Tech, Finance, Healthcare" className="form-input" />
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} placeholder="e.g., Pune, Maharashtra" className="form-input" />
                    </div>

                    {/* Package */}
                    <div>
                        <label htmlFor="packageOffered" className="block text-sm font-medium text-gray-700 mb-1">Package Offered</label>
                        <input type="text" name="packageOffered" id="packageOffered" value={formData.packageOffered} onChange={handleChange} placeholder="e.g., 12 LPA or 50k/month" className="form-input" />
                    </div>

                    {/* Placement Date */}
                    <div>
                        <label htmlFor="placementDate" className="block text-sm font-medium text-gray-700 mb-1">Placement Date</label>
                        <input type="date" name="placementDate" id="placementDate" value={formData.placementDate} onChange={handleChange} className="form-input" />
                    </div>

                    {/* Job Roles */}
                    <div>
                        <label htmlFor="jobRoles" className="block text-sm font-medium text-gray-700 mb-1">Job Roles</label>
                        <input type="text" name="jobRoles" id="jobRoles" value={formData.jobRoles} onChange={handleChange} placeholder="SDE, Data Analyst, UI/UX" className="form-input" />
                        <p className="text-xs text-gray-500 mt-1">Use commas (,) to separate roles.</p>
                    </div>

                    {/* Placement Status */}
                    <div>
                        <label htmlFor="placementStatus" className="block text-sm font-medium text-gray-700 mb-1">Placement Status</label>
                        <select name="placementStatus" id="placementStatus" value={formData.placementStatus} onChange={handleChange} className="form-select">
                            <option value="Not Scheduled">Not Scheduled</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    
                    {/* Placement Type */}
                    <div>
                        <label htmlFor="placementType" className="block text-sm font-medium text-gray-700 mb-1">Placement Type</label>
                        <select name="placementType" id="placementType" value={formData.placementType} onChange={handleChange} className="form-select">
                            <option value="On-Campus">On-Campus</option>
                            <option value="Off-Campus">Off-Campus</option>
                            <option value="Pool-Campus">Pool-Campus</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    
                    {/* HR Contact Name */}
                    <div>
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">HR Contact Name</label>
                        <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" />
                    </div>
                    
                    {/* HR Contact Email */}
                    <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">HR Contact Email</label>
                        <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleChange} className="form-input" />
                    </div>

                    {/* HR Contact Phone */}
                    <div>
                        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">HR Contact Phone</label>
                        <input type="tel" name="contactPhone" id="contactPhone" value={formData.contactPhone} onChange={handleChange} className="form-input" />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                        <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} className="form-textarea" placeholder="Brief overview of the company..."></textarea>
                    </div>

                    {/* Eligibility Criteria */}
                    <div className="md:col-span-2">
                        <label htmlFor="eligibilityCriteria" className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                        <textarea name="eligibilityCriteria" id="eligibilityCriteria" rows="4" value={formData.eligibilityCriteria} onChange={handleChange} className="form-textarea" placeholder="e.g., 7.0+ CGPA, All branches, No active backlogs..."></textarea>
                    </div>
                </div>

                {/* --- Submission Area --- */}
                <div className="mt-8 border-t pt-6 flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <Send size={18} className="mr-2" />
                        )}
                        {loading ? 'Submitting...' : 'Post Job'}
                    </button>
                    
                    {/* Status Messages */}
                    <div className="text-sm">
                        {success && <p className="font-medium text-green-600">Job Posted Successfully! Redirecting...</p>}
                        {error && <p className="font-medium text-red-600">{error}</p>}
                    </div>
                </div>
            </form>
            
          
            <style jsx global>{`
                .form-input, .form-textarea, .form-select {
                    width: 100%;
                    padding: 0.65rem 0.75rem;
                    border: 1px solid #D1D5DB; /* border-gray-300 */
                    border-radius: 0.375rem; /* rounded-md */
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
                    transition: border-color 0.2s, box-shadow 0.2s;
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
// This exports the full page layout
export default function PostJobPage() {
  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <PostJobForm />
      </main>
    </div>
  );
}