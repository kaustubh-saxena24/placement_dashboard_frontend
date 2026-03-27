import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; 


const DashboardCard = () => {
  const [activeFilter, setActiveFilter] = useState("Last Month");
  const [cardData, setCardData] = useState([
    { title: "PLACED STUDENTS", value: 0, percentage: 0, isPositive: true },
    { title: "TOTAL COMPANY VISITS", value: 0, percentage: 0, isPositive: true },
    { title: "APPLICATION PER COMPANY", value: 0, percentage: 0, isPositive: true },
  ]);
  const [loading, setLoading] = useState(true);

  const filters = ["Last Month", "Last 3 Months", "Last 6 Months", "Last Year", "All Time"];

  // Fetch data when the component loads or when the filter changes
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch stats from our new API endpoint
        const res = await axios.get(`https://placement-dashboard-u8av.onrender.com/api/analytics/stats?filter=${activeFilter}`);
        
        const { placedStudents, companyVisits, appPerCompany } = res.data;

        // Update the cardData state with the new values
        setCardData([
          { 
            title: "PLACED STUDENTS", 
            value: placedStudents.value, 
            percentage: placedStudents.percentage, 
            isPositive: placedStudents.isPositive 
          },
          { 
            title: "TOTAL COMPANY VISITS", 
            value: companyVisits.value, 
            percentage: companyVisits.percentage, 
            isPositive: companyVisits.isPositive 
          },
          { 
            title: "APPLICATION PER COMPANY", 
            value: appPerCompany.value, 
            percentage: appPerCompany.percentage, 
            isPositive: appPerCompany.isPositive 
          },
        ]);
        
      } catch (error) {
        console.error("Error fetching analytics stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [activeFilter]); 

  const LoadingPulse = () => (
    <div className="w-16 h-8 bg-gray-300 rounded-md animate-pulse"></div>
  );

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
          Placement Overview
        </h1>
        {/* Time Filter */}
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

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card, index) => {
            const percentageColor = card.isPositive ? "text-green-500" : "text-red-500";
            
          
            const arrowIcon = card.isPositive ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 inline ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 inline ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            );

            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/50 min-w-[240px] flex-grow"
              >
                <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">{card.title}</h3>
                <div className="flex justify-between items-center">
                  {loading ? (
                    <LoadingPulse />
                  ) : (
                    <span className="text-2xl md:text-4xl font-bold text-blue-800">{card.value}</span>
                  )}
                  
                  {!loading && (
                    <span className={`text-xs md:text-sm font-semibold flex items-center ${percentageColor}`}>
                      {card.isPositive ? `+${card.percentage}%` : `-${card.percentage}%`}
                      {arrowIcon}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export function Analytics() {
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-white-100 space-y-6"> 
      <DashboardCard />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DepartmentAnalytics />
          <CircularSegment />
        
      </div>
    </div>
  );
}

// --- UPDATED DepartmentAnalytics Component ---
// This component is now dynamic and fetches student data.
const DepartmentAnalytics = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("Select Department");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all student data once
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('https://placement-dashboard-u8av.onrender.com/api/students');
        setStudents(res.data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);
  
  // Get all unique branch names for the dropdown
  const departments = useMemo(() => {
    const branchSet = new Set(students.map(s => s.branch));
    return Array.from(branchSet).filter(Boolean); // Filter out any null/undefined
  }, [students]);

  // Calculate stats based on selected department
  const departmentStats = useMemo(() => {
    if (selectedDepartment === "Select Department" || students.length === 0) {
      return { total: 0, placed: 0, placementRate: 0 };
    }
    
    const filteredStudents = students.filter(s => s.branch === selectedDepartment);
    const total = filteredStudents.length;
    const placed = filteredStudents.filter(s => s.status === 'Placed').length;
    const placementRate = total > 0 ? (placed / total) * 100 : 0;
    
    return { total, placed, placementRate };
  }, [selectedDepartment, students]);

  // Data for the progress bars
  const analyticsData = [
    { label: "Total Students", value: departmentStats.total, displayValue: departmentStats.total },
    { label: "Placed Students", value: departmentStats.placed, displayValue: departmentStats.placed },
    { label: "Placement Rate", value: departmentStats.placementRate, displayValue: `${departmentStats.placementRate.toFixed(1)}%` },
  ];
  
  // Helper to get max value for progress bar scaling
  const getMaxValue = (label) => {
    if (label === "Placement Rate") return 100;
    if (label === "Placed Students") return departmentStats.total || 1; 
    return departmentStats.total || 1;
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 w-full">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Department Analytics</h2>

      <select
        className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 mb-8"
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        disabled={loading}
      >
        <option value="Select Department" disabled>Select Department</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      <div className="space-y-6">
        {analyticsData.map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center text-gray-600">
              <span className="text-sm md:text-base font-medium">{data.label}</span>
              <span className="text-sm md:text-base font-semibold">{data.displayValue}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(data.value / getMaxValue(data.label)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const CircularSegment = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  
  const branchColors = {
    "Computer Science": "#3B82F6",
    "Information Technology": "#1D4ED8",
    "Electronics": "#F59E0B",
    "Civil": "#10B981",
    "Mechanical": "#EF4444",
   
  };
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get('https://placement-dashboard-u8av.onrender.com/api/students');
        const students = res.data || [];
        setTotalStudents(students.length);

        // Group students by branch
        const counts = students.reduce((acc, student) => {
          const branch = student.branch || "Other";
          acc[branch] = (acc[branch] || 0) + 1;
          return acc;
        }, {});
        
        // Map to chart data format
        const chartData = Object.entries(counts).map(([name, value]) => ({
          name,
          value,
          color: branchColors[name] || '#6B7280' // Fallback color
        }));

        setDepartmentData(chartData);
      } catch (error) {
        console.error("Error fetching student data for chart:", error);
      }
    };
    
    fetchStudentData();
  }, []);

  const CircleSegment = ({ color, circumference, offset }) => (
    <circle
      className="transition-all duration-500 ease-in-out"
      cx="60"
      cy="60"
      r="50"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeDasharray={`${circumference} ${circumference}`} // Fix: Use template literal for full circle
      strokeDashoffset={offset}
      strokeLinecap="round"
    />
  );

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 w-full flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
      
      <div className="flex-shrink-0 relative w-48 h-48">
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10" />
          {(() => {
            const totalCircumference = 2 * Math.PI * 50;
            let offset = totalCircumference;
            return departmentData.map((data, index) => {
              if (totalStudents === 0) return null; // Avoid division by zero
              const segmentLength = (data.value / totalStudents) * totalCircumference;
              offset -= segmentLength; // This logic works by "drawing" segments backward
              return (
                <CircleSegment key={index} color={data.color} circumference={totalCircumference} offset={offset} />
              );
            });
          })()}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-gray-600 text-sm">Students</span>
          <span className="text-blue-600 font-bold text-3xl mt-1">{totalStudents}</span>
        </div>
      </div>

      
      <div className="flex-grow w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Students</h2>
        <div className="grid grid-cols-2 gap-4">
          {departmentData.map((dept, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dept.color }}></span>
              <span className="text-sm text-gray-700 truncate" title={dept.name}>{dept.name}</span>
              <span className="text-sm font-semibold text-gray-800">{dept.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

