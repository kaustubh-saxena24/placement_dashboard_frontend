import React, { useState, useEffect } from 'react';
import axios from 'axios';



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




const DashboardCard = () => {
  const [activeFilter, setActiveFilter] = useState("Last Month");
  const [stats, setStats] = useState({
    placedStudents: { value: 0, percentage: 0, isPositive: true },
    companyVisits: { value: 0, percentage: 0, isPositive: true },
    appPerCompany: { value: 0, percentage: 0, isPositive: true },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardDataMap = [
    { title: "PLACED STUDENTS", key: "placedStudents" },
    { title: "TOTAL COMPANY VISITS", key: "companyVisits" },
    { title: "APPLICATION PER COMPANY", key: "appPerCompany" },
  ];
  const filters = ["Last Month", "Last 3 Months", "Last 6 Months", "Last Year", "All Time"];

  // Fetch data when the filter changes
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://placement-dashboard-u8av.onrender.com/api/analytics/stats`, {
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

        {error ? (
          <div className="text-red-500 text-center col-span-3">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardDataMap.map((card, index) => {
              const data = stats[card.key];
              const percentageColor = data.isPositive ? "text-green-500" : "text-red-500";
              const arrowIcon = data.isPositive ? <UpArrowIcon /> : <DownArrowIcon />;

              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/50 min-w-[240px] flex-grow"
                >
                  <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">{card.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl md:text-4xl font-bold text-blue-800">{loading ? '...' : data.value}</span>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};



function UpcomingCompanies() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedPackage, setSelectedPackage] = useState("All");

  // Fetch data on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('https://placement-dashboard-u8av.onrender.com/api/companies');
        
        // Filter for only "Upcoming" and "Ongoing" companies for this table
        const relevantCompanies = response.data.filter(
          comp => comp.placementStatus === "Upcoming" || comp.placementStatus === "Ongoing"
        );
        
        setAllCompanies(relevantCompanies);
        setFilteredCompanies(relevantCompanies);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load company data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Re-run filter logic when filters or data change
  useEffect(() => {
    let updatedList = allCompanies;

    // --- FIX: Check for company.placementDate before trying to filter ---
    if (selectedDate !== "All") {
      updatedList = updatedList.filter(company => {
        if (!company.placementDate) return false; // Exclude if no date
        return new Date(company.placementDate).toISOString().split('T')[0] === selectedDate;
      });
    }

    if (selectedPackage !== "All") {
      updatedList = updatedList.filter(company => company.packageOffered === selectedPackage);
    }

    setFilteredCompanies(updatedList);
  }, [selectedDate, selectedPackage, allCompanies]);

  // Derive unique filter options from the fetched data
  // --- FIX: Filter out null/undefined dates before mapping ---
  const uniqueDates = ["All", ...new Set(
    allCompanies
      .map(item => item.placementDate)
      .filter(Boolean) // Filter out falsy values (null, undefined)
      .map(dateString => new Date(dateString).toISOString().split('T')[0])
      .sort()
  )];
  const uniquePackages = ["All", ...new Set(
    allCompanies.map(item => item.packageOffered).filter(Boolean).sort()
  )];

  // Helper to format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // This check correctly handles null/undefined
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl mx-auto bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl p-4 md:p-6 border border-white/50">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-200 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Upcoming Companies</h1>
          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            <span className="text-sm text-gray-500 font-medium">Filter by:</span>
            
            {/* Date Filter */}
            <select
              className="bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-full text-sm focus:outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="All">All Dates</option>
              {uniqueDates.slice(1).map((date, i) => (
                <option key={i} value={date}>{formatDate(date)}</option>
              ))}
            </select>

            {/* Package Filter */}
            <select
              className="bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-full text-sm focus:outline-none"
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
            >
              <option value="All">All Packages</option>
              {uniquePackages.slice(1).map((pkg, i) => (
                <option key={i} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Company</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Job Title(s)</th>
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
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company._id}>
                    <td className="px-4 py-2 font-medium text-gray-900">{company.name}</td>
                    <td className="px-4 py-2 text-gray-700">{company.jobRoles.join(', ')}</td>
                    <td className="px-4 py-2 text-gray-700">{company.packageOffered || 'N/A'}</td>
                    {/* This line is safe because formatDate handles null values */}
                    <td className="px-4 py-2 text-gray-700">{formatDate(company.placementDate)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          company.placementStatus === "Ongoing"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {company.placementStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    No upcoming companies found.
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


// --- 3. Main HomePage Component (Wrapper) ---

export default function HomePage() {
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-white-100 space-y-6">
      <DashboardCard />
      <div className="grid grid-cols-1 gap-6">
        <UpcomingCompanies />
      </div>
    </div>
  );
}

