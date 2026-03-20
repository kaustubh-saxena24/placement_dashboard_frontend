import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import { 
    UserPlus, FilePlus, LogOut, FileText, RefreshCw, 
    Briefcase, CheckCircle, DollarSign, Settings
} from 'lucide-react';
import { Modal, Button, Input, message, Table, Tag, Card, Select, Divider } from 'antd';

const API_BASE_URL = 'http://localhost:5000/api';

// --- 1. Sidebar Component ---
function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    navigate("/login");
  }

  return (
    <aside className="w-[20%] max-w-64 min-w-48 h-screen bg-white flex flex-col justify-between border-r border-gray-200 sticky top-0">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <NavLink to={'/college-dashboard'}> 
          <h1 className="text-xl font-bold text-blue-500">Placement</h1>
        </NavLink>
      </div>

      <nav className="flex-1 p-6">
        <SidebarItem to="/JobPost" icon={<FilePlus size={20} />} text="Add Job Posting" />
        <SidebarItem to="/AddStudent" icon={<UserPlus size={20} />} text="Add New Student" />
        <SidebarItem to="/view-applications" icon={<FileText size={20} />} text="View Applications" />
        <SidebarItem to="/mark-placed" icon={<Briefcase size={20} />} text="Mark Placed" />
        <SidebarItem to="/update-requests" icon={<RefreshCw size={20} />} text="Update Requests" />
        
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button onClick={logout} className="w-full flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, text }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex items-center mt-2 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}>
      {icon}
      <span className="ml-3 font-medium">{text}</span>
    </NavLink>
  );
}

// --- 2. Main Content ---

function MarkPlacedContent() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [selectedCompanyData, setSelectedCompanyData] = useState(null); // Stores full company object
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [packageOffered, setPackageOffered] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);

    // Fetch Companies
    const fetchCompanies = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/companies`);
            setCompanies(res.data);
            
            // If a company is already selected, update its local data (in case status changed)
            if (selectedCompanyId) {
                const updatedData = res.data.find(c => c._id === selectedCompanyId);
                setSelectedCompanyData(updatedData);
            }
        } catch (err) {
            message.error("Failed to fetch companies");
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []); // Initial load

    // Handle Company Selection Change
    const handleCompanyChange = (value) => {
        setSelectedCompanyId(value);
        const companyData = companies.find(c => c._id === value);
        setSelectedCompanyData(companyData);
    };

    // Fetch Applicants when Company Changes
    useEffect(() => {
        if (!selectedCompanyId) {
            setApplicants([]);
            return;
        }
        const fetchApplicants = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/applications/company/${selectedCompanyId}`);
                const data = res.data.data || res.data || [];
                setApplicants(data);
            } catch (err) {
                message.error("Failed to fetch applicants");
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [selectedCompanyId]);

    // --- NEW: Handle Status Update ---
    const handleStatusUpdate = async (newStatus) => {
        if(!selectedCompanyId) return;

        try {
            await axios.put(`${API_BASE_URL}/companies/${selectedCompanyId}/status`, {
                status: newStatus
            });
            message.success(`Drive status updated to ${newStatus}`);
            
            // Update local state immediately for fast UI feedback
            setSelectedCompanyData(prev => ({ ...prev, placementStatus: newStatus }));
            
            // Update the main list in background
            fetchCompanies(); 
        } catch (err) {
            console.error(err);
            message.error("Failed to update status");
        }
    };

    // Handle Click "Mark as Placed"
    const openPlacementModal = (student) => {
        setCurrentStudent(student);
        setPackageOffered(''); 
        setIsModalOpen(true);
    };

    // Handle Submit Placement
    const handleConfirmPlacement = async () => {
        if (!packageOffered) {
            message.warning("Please enter the package offered (e.g., 12 LPA)");
            return;
        }

        setConfirmLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/placements/mark-placed`, {
                studentId: currentStudent._id,
                companyId: selectedCompanyId,
                packageOffered: packageOffered
            });

            message.success(`${currentStudent.name} marked as Placed!`);
            setIsModalOpen(false);
            
            setApplicants(prev => prev.map(app => 
                app._id === currentStudent._id ? { ...app, status: 'Offered' } : app
            ));

        } catch (err) {
            message.error(err.response?.data?.message || "Failed to update status");
        } finally {
            setConfirmLoading(false);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <div className="font-medium text-gray-900">{text}</div>
                    <div className="text-xs text-gray-500">{record.email}</div>
                </div>
            )
        },
        {
            title: 'Branch',
            dataIndex: 'branch',
            key: 'branch',
        },
        {
            title: 'Current Status',
            dataIndex: 'status', 
            key: 'status',
            render: (status) => {
                let color = status === 'Offered' ? 'green' : 'blue';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    type="primary" 
                    size="small"
                    className="bg-green-600 hover:bg-green-700 border-green-600 flex items-center"
                    icon={<CheckCircle size={14} />}
                    disabled={record.status === 'Offered' || record.status === 'Placed'}
                    onClick={() => openPlacementModal(record)}
                >
                    {record.status === 'Offered' ? 'Placed' : 'Mark Placed'}
                </Button>
            )
        }
    ];

    // Helper for Status Badge Color
    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'green';
            case 'Ongoing': return 'gold';
            case 'Upcoming': return 'blue';
            default: return 'default';
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Briefcase className="mr-3" size={30} />
                    Manage Drive & Placements
                </h1>
            </div>

            {/* Selection & Management Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left: Select Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Company / Drive</label>
                        <Select 
                            className="w-full"
                            placeholder="Select Company"
                            size="large"
                            value={selectedCompanyId || undefined}
                            onChange={handleCompanyChange}
                            options={companies.map(c => ({ 
                                value: c._id, 
                                label: `${c.name} (${new Date(c.placementDate).toLocaleDateString()})` 
                            }))}
                        />
                        <p className="text-gray-500 text-xs mt-2">Select a company to load applicants and manage drive status.</p>
                    </div>

                    {/* Right: Drive Status Management (Visible only when company selected) */}
                    {selectedCompanyData && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600 flex items-center">
                                    <Settings size={14} className="mr-1" /> Drive Status
                                </span>
                                <Tag color={getStatusColor(selectedCompanyData.placementStatus)}>
                                    {selectedCompanyData.placementStatus}
                                </Tag>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Select 
                                    className="w-full"
                                    value={selectedCompanyData.placementStatus}
                                    onChange={handleStatusUpdate}
                                    options={[
                                        { value: 'Upcoming', label: 'Upcoming' },
                                        { value: 'Ongoing', label: 'Ongoing' },
                                        { value: 'Completed', label: 'Completed' },
                                        { value: 'Not Scheduled', label: 'Not Scheduled' },
                                    ]}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Applicants Table */}
            <Card className="shadow-lg rounded-2xl border-0" title="Applicant List">
                <Table 
                    dataSource={applicants} 
                    columns={columns} 
                    rowKey="applicationId" 
                    loading={loading}
                    locale={{ emptyText: selectedCompanyId ? "No applicants found." : "Please select a company above." }}
                />
            </Card>

            {/* Placement Modal */}
            <Modal
                title="Confirm Placement"
                open={isModalOpen}
                onOk={handleConfirmPlacement}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={confirmLoading}
                okText="Confirm & Mark Placed"
                okButtonProps={{ className: 'bg-green-600' }}
            >
                <div className="pt-4 pb-2">
                    <p className="mb-4 text-gray-600">
                        You are marking <strong>{currentStudent?.name}</strong> as placed at <strong>{selectedCompanyData?.name}</strong>.
                    </p>
                    
                    <label className="block text-sm font-medium text-gray-700 mb-1">Package Offered (LPA) *</label>
                    <Input 
                        prefix={<DollarSign size={16} className="text-gray-400" />}
                        placeholder="e.g., 12.5 LPA" 
                        value={packageOffered}
                        onChange={(e) => setPackageOffered(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
}

// --- 3. Wrapper ---
export default function MarkPlaced() {
  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <MarkPlacedContent />
      </main>
    </div>
  );
}