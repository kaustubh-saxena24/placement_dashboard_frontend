import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Alert, List, Avatar, Spin, message } from 'antd'; // Added message for toast notifications

// --- SVG Icons ---

const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

const BriefcaseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// --- Helper Functions ---

const getStudentId = () => {
  const userData = localStorage.getItem('placementUser');
  if (!userData) return null;
  try {
    const student = JSON.parse(userData);
    return student.id; // Ensure this matches your login response structure
  } catch (e) {
    return null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Date TBD';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Helper Components ---

const StatusPill = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Upcoming': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'Not Scheduled': default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${getStatusClasses()}`}>
      {status}
    </div>
  );
};

/**
 * Button for Applying or Viewing Placed Students
 * UPDATED: Accepts `appliedIds` to check if student already applied.
 */
const ActionButton = ({ item, onApplySuccess, onShowPlaced, appliedIds }) => {
  const [loading, setLoading] = useState(false);
  const studentId = getStudentId();

  // Check if current item ID exists in the Set of applied IDs
  const isAlreadyApplied = appliedIds && appliedIds.has(item.id);

  const handleApply = (e) => {
    e.stopPropagation(); 
    
    if (!studentId) {
      Modal.error({ title: 'Not Logged In', content: 'You must be logged in to apply.' });
      return;
    }

    Modal.confirm({
      title: 'Confirm Application',
      content: `Are you sure you want to apply to ${item.company} for the ${item.role} role?`,
      okText: 'Yes, Apply',
      cancelText: 'Cancel',
      okButtonProps: { loading: loading, className: "bg-blue-600" },
      onOk: async () => {
        setLoading(true);
        try {
          await axios.post('http://localhost:5000/api/applications', {
            studentId: studentId,
            companyId: item.id,
          });
          
          message.success(`Applied to ${item.company} successfully!`);
          onApplySuccess(item.id); // Update parent state
          
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Application failed.';
          
          // If backend says duplicate, we should update our UI state to match
          if(err.response?.status === 400 && errorMessage.includes('already applied')) {
             onApplySuccess(item.id); 
             message.warning("You have already applied to this company.");
          } else {
             Modal.error({ title: 'Application Failed', content: errorMessage });
          }
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleShowPlaced = (e) => {
    e.stopPropagation();
    onShowPlaced(item);
  };

  if (item.status === 'Upcoming' || item.status === 'Ongoing') {
    return (
      <Button
        type={isAlreadyApplied ? "default" : "primary"}
        className={isAlreadyApplied ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
        loading={loading}
        disabled={isAlreadyApplied}
        onClick={!isAlreadyApplied ? handleApply : undefined}
      >
        {isAlreadyApplied ? 'Applied' : 'Apply Now'}
      </Button>
    );
  }

  if (item.status === 'Completed') {
    return (
      <Button onClick={handleShowPlaced}>
        View Placed Students
      </Button>
    );
  }

  return null;
};

/**
 * Company Card
 * UPDATED: Passes `appliedIds` down to ActionButton
 */
const CompanyCard = ({ item, onCardClick, onApplySuccess, onShowPlaced, appliedIds }) => {
  return (
    <div
      className="bg-white/70 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden border border-gray-200/80 cursor-pointer"
      onClick={() => onCardClick(item)}
    >
      <div className="p-6">
        <div className="flex items-start space-x-5">
          <img src={item.logo} alt={`${item.company} logo`} className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <h2 className="text-2xl font-bold text-gray-800 truncate">{item.company}</h2>
              <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-shrink-0">
                <StatusPill status={item.status} />
                <div className={`flex items-center text-xs font-semibold px-3 py-1 rounded-full ${item.type === 'On-Campus' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'}`}>
                  <MapPinIcon className="w-3.5 h-3.5 mr-1.5" />
                  {item.type}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center text-gray-600">
              <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-400" />
              <p className="text-md font-medium truncate">{item.role}</p>
            </div>
            {item.date && (
              <div className="mt-2 flex items-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                <time className="text-md font-medium">{formatDate(item.date)}</time>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <ActionButton
            item={item}
            onApplySuccess={onApplySuccess}
            onShowPlaced={onShowPlaced}
            appliedIds={appliedIds} // Passed down
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Company Detail Modal
 * UPDATED: Passes `appliedIds` down to ActionButton
 */
const CompanyDetailModal = ({ item, open, onClose, onApplySuccess, onShowPlaced, appliedIds }) => {
  if (!item) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      title={
        <div className="flex items-center space-x-4">
          <img src={item.logo} alt={`${item.company} logo`} className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{item.company}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusPill status={item.status} />
              <div className={`flex items-center text-xs font-semibold px-3 py-1 rounded-full ${item.type === 'On-Campus' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'}`}>
                <MapPinIcon className="w-3.5 h-3.5 mr-1.5" />
                {item.type}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Description</h3>
          <p className="text-gray-700 mt-1">{item.description || 'No description provided.'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Role</h3>
                <p className="text-gray-900">{item.role}</p>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Package</h3>
                <p className="text-gray-900">{item.package}</p>
            </div>
        </div>
        
        <div>
           <h3 className="text-sm font-semibold text-gray-500 uppercase">Eligibility</h3>
           <p className="text-gray-900">{item.eligibility}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Schedule & Location</h3>
          <p className="text-gray-700 mt-1">
            <strong>Date:</strong> {formatDate(item.date)} <br />
            <strong>Location:</strong> {item.location}
          </p>
        </div>

        {item.website && (
          <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium block mt-2">
            Visit Official Website
          </a>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
        <ActionButton
          item={item}
          onApplySuccess={onApplySuccess}
          onShowPlaced={onShowPlaced}
          appliedIds={appliedIds} // Passed down
        />
      </div>
    </Modal>
  );
};

const PlacedStudentsModal = ({ item, open, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && item) {
      const fetchPlacedStudents = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get(`https://placement-dashboard-u8av.onrender.com/api/companies/${item.id}/placed-students`);
          setStudents(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch students.');
        } finally {
          setLoading(false);
        }
      };
      fetchPlacedStudents();
    }
  }, [open, item]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Close</Button>}
      title={`Students Placed at ${item?.company}`}
    >
      {loading && <div className="text-center p-8"><Spin size="large" /></div>}
      {error && <Alert message={error} type="error" showIcon />}
      
      {!loading && !error && (
        <>
          <List
            itemLayout="horizontal"
            dataSource={students}
            renderItem={(student) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar className="bg-blue-600 text-white">{(student.name?.[0] || 'S').toUpperCase()}</Avatar>}
                  title={<span className="font-semibold">{student.name}</span>}
                  description={`${student.branch} | ${student.studentId}`}
                />
                <div className="text-gray-600">{student.packageOffered}</div>
              </List.Item>
            )}
          />
          {students.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              No placed students found for this company.
            </div>
          )}
        </>
      )}
    </Modal>
  );
};


// --- Main Schedule Component ---

export default function Schedule() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  
  // NEW: State to store IDs of companies the student has already applied to
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Modal States
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [placedModalOpen, setPlacedModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // 1. Fetch Companies
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/companies');

        const transformedData = response.data.map(company => ({
          id: company._id,
          company: company.name,
          website: company.website,
          description: company.description,
          location: company.location,
          status: company.placementStatus,
          date: company.placementDate,
          role: company.jobRoles?.join(', ') || company.industry || 'Various Roles',
          type: company.placementType || 'On-Campus',
          package: company.packageOffered,
          eligibility: company.eligibilityCriteria,
          logo: `https://placehold.co/100x100/7c3aed/ffffff?text=${company.name.substring(0, 2).toUpperCase()}`,
        }));

        setAllCompanies(transformedData);
        setIsEmpty(transformedData.length === 0);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 2. Fetch User's Existing Applications
    // NOTE: You need to implement this backend route: GET /api/applications/student/:studentId
    const fetchUserApplications = async () => {
        const studentId = getStudentId();
        if(!studentId) return;

        try {
            const res = await axios.get(`http://localhost:5000/api/applications/student/${studentId}`);
            if(res.data.success) {
                // Assuming res.data.data is an array of application objects { company: "companyId", ... }
                const appliedCompanyIds = new Set(res.data.data.map(app => app.company));
                setAppliedIds(appliedCompanyIds);
            }
        } catch (err) {
            console.log("Could not fetch application history (endpoint might not exist yet).");
        }
    };

    fetchScheduleData();
    fetchUserApplications();
  }, []); 

  // --- Handlers ---
  
  const handleCardClick = (item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleShowPlaced = (item) => {
    setSelectedItem(item);
    setDetailModalOpen(false); 
    setPlacedModalOpen(true);
  };

  const handleApplySuccess = (companyId) => {
    // Add the new companyId to the Set of applied IDs
    setAppliedIds(prev => new Set(prev).add(companyId));
  };

  const handleCloseDetail = () => setDetailModalOpen(false);
  const handleClosePlaced = () => setPlacedModalOpen(false);

  // --- Grouping ---
  const getGroupedSchedule = () => {
    const grouped = {
      Ongoing: [],
      Upcoming: [],
      Completed: [],
      'Not Scheduled': [],
    };

    for (const item of allCompanies) {
      if (grouped.hasOwnProperty(item.status)) {
        grouped[item.status].push(item);
      }
    }

    grouped.Ongoing.sort((a, b) => new Date(a.date) - new Date(b.date));
    grouped.Upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    grouped.Completed.sort((a, b) => new Date(b.date) - new Date(a.date));

    return grouped;
  };
  
  const groupedSchedule = getGroupedSchedule();

  const renderSection = (title, data) => {
    if (!data || data.length === 0) return null;

    return (
      <section>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 pb-2 border-b-2 border-purple-200">
          {title}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.map(item => (
            <CompanyCard
              key={item.id}
              item={item}
              onCardClick={handleCardClick}
              onApplySuccess={handleApplySuccess}
              onShowPlaced={handleShowPlaced}
              appliedIds={appliedIds} // Passing down the Set
            />
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="bg-white/70 min-h-screen font-sans flex items-center justify-center">
        <h2 className="text-2xl font-medium text-gray-700">Loading Schedule...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/70 min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-red-600">Error fetching data</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white/70 min-h-screen font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-10 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Placement Schedule
            </h1>
          </header>
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">No companies scheduled.</h3>
            <p className="text-gray-500 mt-2">Please check back later for updates.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Placement Schedule
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
            Company drives and interview rounds. Stay prepared!
          </p>
        </header>

        <main className="space-y-12">
          {renderSection('Ongoing Drives', groupedSchedule?.Ongoing)}
          {renderSection('Upcoming Drives', groupedSchedule?.Upcoming)}
          {renderSection('Completed Drives', groupedSchedule?.Completed)}
          {renderSection('Not Scheduled', groupedSchedule?.['Not Scheduled'])}
        </main>
      </div>

      <CompanyDetailModal
        item={selectedItem}
        open={detailModalOpen}
        onClose={handleCloseDetail}
        onApplySuccess={handleApplySuccess}
        onShowPlaced={handleShowPlaced}
        appliedIds={appliedIds} // Passing down the Set
      />

      <PlacedStudentsModal
        item={selectedItem}
        open={placedModalOpen}
        onClose={handleClosePlaced}
      />
    </div>
  );
}