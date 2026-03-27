import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import { UserPlus, FilePlus, LogOut, Send, FileText,RefreshCw,Briefcase } from "lucide-react";

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




function AddStudentForm() {
    const navigate = useNavigate();
    
    const initialState = {
        studentId: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        college: '',
        branch: '',
        currentYear: '',
        semester: '',
        cgpa: '',
        activeBacklogs: 0,
        tenthGradePercentage: '',
        twelfthGradePercentage: '',
        address: '',
        profilePicUrl: '',
        status: 'Not Placed', 
        isEligibleForPlacement: true, 
        resumeUrl: '',
        placedInCompany: null,
        packageOffered: null,
        role: 'Student' 
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        
        let finalValue = value;
        if (type === 'checkbox') {
            finalValue = checked;
        } else if (type === 'number') {
            finalValue = value === '' ? '' : parseFloat(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        
        if (!formData.email || !formData.password || !formData.studentId || !formData.name) {
            setError('Please fill in all required fields (*).');
            setLoading(false);
            return;
        }
        
        
        const payload = {
            ...formData,
            cgpa: formData.cgpa === '' ? null : formData.cgpa,
            currentYear: formData.currentYear === '' ? null : formData.currentYear,
            semester: formData.semester === '' ? null : formData.semester,
            tenthGradePercentage: formData.tenthGradePercentage === '' ? null : formData.tenthGradePercentage,
            twelfthGradePercentage: formData.twelfthGradePercentage === '' ? null : formData.twelfthGradePercentage,
          
            activeBacklogs: formData.activeBacklogs === '' ? 0 : formData.activeBacklogs,
        };

        try {
            
            const response = await axios.post('https://placement-dashboard-u8av.onrender.com/api/students', payload);

            setSuccess(true);
            setFormData(initialState); 
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (err) {
            console.error("Error adding student:", err);
            
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to add student. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <UserPlus className="mr-3" size={30} />
                Add New Student
            </h1>

            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                    <h2 className="md:col-span-2 text-lg font-semibold text-gray-700 border-b pb-2">Personal & Login Details</h2>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student ID / Roll Number *</label>
                        <input type="text" name="studentId" id="studentId" value={formData.studentId} onChange={handleChange} required className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className="form-input" />
                        <p className="text-xs text-gray-500 mt-1">Set an initial password for the student.</p>
                    </div>

                    
                    <h2 className="md:col-span-2 text-lg font-semibold text-gray-700 border-b pb-2 mt-4">Academic Details</h2>
                    <div>
                        <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                        <input type="text" name="college" id="college" value={formData.college} onChange={handleChange} className="form-input" />
                    </div>
                     <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                        <input type="text" name="branch" id="branch" value={formData.branch} onChange={handleChange} placeholder="e.g., CSE, ECE" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="currentYear" className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
                        <input type="number" name="currentYear" id="currentYear" value={formData.currentYear} onChange={handleChange} placeholder="e.g., 4" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <input type="number" name="semester" id="semester" value={formData.semester} onChange={handleChange} placeholder="e.g., 8" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-1">CGPA (out of 10)</label>
                        <input type="number" name="cgpa" id="cgpa" value={formData.cgpa} onChange={handleChange} step="0.01" min="0" max="10" className="form-input" />
                    </div>
                     <div>
                        <label htmlFor="activeBacklogs" className="block text-sm font-medium text-gray-700 mb-1">Active Backlogs</label>
                        <input type="number" name="activeBacklogs" id="activeBacklogs" value={formData.activeBacklogs} onChange={handleChange} min="0" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="tenthGradePercentage" className="block text-sm font-medium text-gray-700 mb-1">10th Percentage</label>
                        <input type="number" name="tenthGradePercentage" id="tenthGradePercentage" value={formData.tenthGradePercentage} onChange={handleChange} step="0.01" min="0" max="100" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="twelfthGradePercentage" className="block text-sm font-medium text-gray-700 mb-1">12th Percentage</label>
                        <input type="number" name="twelfthGradePercentage" id="twelfthGradePercentage" value={formData.twelfthGradePercentage} onChange={handleChange} step="0.01" min="0" max="100" className="form-input" />
                    </div>

                   
                    <h2 className="md:col-span-2 text-lg font-semibold text-gray-700 border-b pb-2 mt-4">Profile & Placement</h2>
                     <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
                        <input type="url" name="resumeUrl" id="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="https://link-to-resume.com" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="profilePicUrl" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                        <input type="url" name="profilePicUrl" id="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} placeholder="https://link-to-image.com" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Placement Status</label>
                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="form-select">
                            <option value="Not Placed">Not Placed</option>
                            <option value="Placed">Placed</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                        <label htmlFor="isEligibleForPlacement" className="text-sm font-medium text-gray-700 mr-3">Eligible for Placement?</label>
                        <input 
                            type="checkbox" 
                            name="isEligibleForPlacement" 
                            id="isEligibleForPlacement" 
                            checked={formData.isEligibleForPlacement} 
                            onChange={handleChange} 
                            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                    </div>

                </div>

                
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
                        {loading ? 'Submitting...' : 'Add Student'}
                    </button>
                    
                    
                    <div className="text-sm">
                        {success && <p className="font-medium text-green-600">Student Added Successfully!</p>}
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



export default function AddStudentPage() {
  return (
    <div className="flex min-h-screen font-sans">
   
      <Sidebar />
      
      
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <AddStudentForm />
      </main>
    </div>
  );
}

