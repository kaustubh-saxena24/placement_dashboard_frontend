import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import { UserPlus, FilePlus, LogOut, FileText,RefreshCw ,Briefcase} from "lucide-react";

const API_BASE_URL = 'https://placement-dashboard-u8av.onrender.com/api'; 

// --- Custom Icons for Stats (Kept as requested) ---
const UpArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 8.414V14a1 1 0 11-2 0V8.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);
const DownArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L11.586 11H6a1 1 0 110-2h5.586L10.293 7.707a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

// --- 1. Sidebar Component (Consistent across all pages) ---
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

// --- 2. Dashboard Components ---

const CollegeStatsAndActions = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState("All Time");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardDataMap = [
    { title: "PLACED STUDENTS", key: "placedStudents" }, 
    { title: "TOTAL COMPANY VISITS", key: "companyVisits" }, 
    { title: "ACTIVE JOB POSTINGS", key: "appPerCompany" }, 
  ];
  const filters = ["Last Month", "Last 3 Months", "This Year", "All Time"];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/analytics/stats`, {
          params: { filter: activeFilter }
        });
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching analytics stats:", err);
        setError("Failed to load stats. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [activeFilter]);

  return (
    <div
      className="w-full max-w-7xl mx-auto bg-gray-50 rounded-3xl p-4 md:p-10 shadow-2xl backdrop-blur-lg border border-gray-200"
      style={{
        backgroundImage: "linear-gradient(135deg, #f0f4f8, #e4e7ee)",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-800 mb-8 text-center md:text-left">
          TPO Dashboard Overview 🎓
        </h1>
    
        <div className="flex flex-wrap space-x-2 md:space-x-3 mb-5">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium rounded-full transition-colors duration-200 ${
                activeFilter === filter
                  ? "bg-white text-gray-800 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
       
        {error ? (
          <div className="text-red-500 text-center col-span-3">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const card = cardDataMap[0]; 
              const data = stats[card.key] || { value: 0, percentage: 0, isPositive: true };
              return <StatActionCard data={data} card={card} onNavigate={onNavigate} loading={loading} />;
            })()}
          
            {(() => {
              const card = cardDataMap[1];
              const data = stats[card.key] || { value: 0, percentage: 0, isPositive: true };
              return <StatActionCard data={data} card={card} onNavigate={onNavigate} loading={loading} />;
            })()}
            
            {(() => {
              const card = cardDataMap[2];
              const data = stats[card.key] || { value: 0, percentage: 0, isPositive: true };
              return <StatActionCard data={data} card={card} onNavigate={onNavigate} loading={loading} />;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

const StatActionCard = ({ data, card, loading }) => {
    // FIX: Changed "text-red-5Same" to "text-red-500"
    const percentageColor = data.isPositive ? "text-green-500" : "text-red-500";
    const arrowIcon = data.isPositive ? <UpArrowIcon /> : <DownArrowIcon />;
    
    return (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/50 min-w-[240px] flex-grow flex flex-col justify-between">
            <div>
                <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">{card.title}</h3>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl md:text-3xl font-bold text-blue-800">{loading ? '...' : data.value}</span>
                    <span className={`text-xs md:text-sm font-semibold flex items-center ${percentageColor}`}>
                        {!loading && data.percentage > 0 && (
                            <>
                                {data.isPositive ? `+${data.percentage}%` : `-${data.percentage}%`}
                                {arrowIcon}
                            </>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

function RecentJobPostings() {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchJobs = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(`${API_BASE_URL}/companies`); 
          const activeDrives = response.data.filter(
              job => job.placementStatus === "Upcoming" || job.placementStatus === "Ongoing"
          ).slice(0, 5); 
  
          setJobPostings(activeDrives); 
        } catch (err) {
          console.error("Error fetching job postings:", err);
          setError("Failed to load recent job postings.");
        } finally {
          setLoading(false);
        }
      };
      fetchJobs();
    }, []);
  
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    };
  
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-7xl mx-auto bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl p-4 md:p-6 border border-white/50">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-200 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Active Placement Drives</h1>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-3 md:mt-0">View All Drives &rarr;</button>
          </div>
  
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Role(s)</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Package</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="5" className="px-4 py-3 text-center text-gray-500">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan="5" className="px-4 py-3 text-center text-red-500">{error}</td></tr>
                ) : jobPostings.length > 0 ? (
                  jobPostings.map((job) => (
                    <tr key={job._id}>
                      <td className="px-4 py-2 font-medium text-gray-900">{job.name}</td> 
                      <td className="px-4 py-2 text-gray-700">{job.jobRoles ? job.jobRoles.join(', ') : 'N/A'}</td>
                      <td className="px-4 py-2 text-gray-700">{job.packageOffered || 'N/A'}</td>
                      <td className="px-4 py-2 text-gray-700">{formatDate(job.placementDate)}</td>
                      <td className="px-4 py-2">
                           <span
                          className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                            job.placementStatus === "Ongoing"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {job.placementStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                      No active placement drives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}

// --- 3. Main Page Layout (Wrapper) ---
export default function CollegeDashboard() {
    
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        if (path === '/logout') {
            console.log("Logging out...");
            navigate('/login');
        } else {
            console.log(`Navigating to: ${path}`);
            navigate(path);
        }
    }

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar - Fixed width & layout */}
      <Sidebar />
      
      {/* Main Content - Flex-1 to take remaining width */}
      <main className="flex-1 p-4 md:p-8 bg-gray-100 space-y-6 overflow-y-auto">
        <CollegeStatsAndActions onNavigate={handleNavigate} />
        <div className="grid grid-cols-1 gap-6">
          <RecentJobPostings />
        </div>
      </main>
    </div>
  );
}