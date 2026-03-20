import { useState } from "react";

const DashboardCard = () => {
  const [activeFilter, setActiveFilter] = useState("Last Month");

  const cardData = [
    { title: "PLACED STUDENTS", value: 74, percentage: 14.63, isPositive: true },
    { title: "TOTAL COMPANY VISITS", value: 74, percentage: 63.46, isPositive: false },
    { title: "APPLICATION PER COMPANY", value: 74, percentage: 59.87, isPositive: false },
  ];

  const filters = ["Last Month", "Last 3 Months", "Last 6 Months", "Last Year", "All Time"];

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
      {/* Time Filter */}
      <h1 className="text-xl md:text-3xl font-semibold text-gray-800 mb-8 text-center md:text-left">
          Placement Overview
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => {
          const percentageColor = card.isPositive ? "text-green-500" : "text-red-500";
          const arrowIcon = card.isPositive ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M14.707 10.293a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L11.586 11H6a1 1 0 110-2h5.586L10.293 7.707a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 8.414V14a1 1 0 11-2 0V8.414L6.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          );

          return (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/50 min-w-[240px] flex-grow"
            >
              <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-1">{card.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-2xl md:text-4xl font-bold text-blue-800">{card.value}</span>
                <span className={`text-xs md:text-sm font-semibold flex items-center ${percentageColor}`}>
                  {card.isPositive ? `+${card.percentage}%` : `-${card.percentage}%`}
                  {arrowIcon}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
    
  );
};

export default DashboardCard;
