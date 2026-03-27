import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import { Table, Card, Button, Tag, Modal, message, Badge, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { 
    Users, 
    FilePlus, 
    UserPlus, 
    FileText, 
    RefreshCw, 
    LogOut ,
    Briefcase
} from 'lucide-react';

const API_BASE_URL = 'https://placement-dashboard-u8av.onrender.com/api';

// --- 1. Sidebar Component (Standardized) ---
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
        <SidebarItem 
            to="/update-requests" 
            icon={<RefreshCw size={20} />} 
            text="Update Requests" 
        />
        
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

function UpdateRequestsContent() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students/admin/pending-updates`);
      setRequests(response.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load update requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle Approve/Decline
  const handleDecision = (studentId, decision) => {
    Modal.confirm({
      title: decision === 'approve' ? 'Approve Updates?' : 'Decline Updates?',
      content: `Are you sure you want to ${decision} this student's profile changes?`,
      okText: decision === 'approve' ? 'Approve' : 'Decline',
      okType: decision === 'approve' ? 'primary' : 'danger',
      onOk: async () => {
        try {
          await axios.post(`${API_BASE_URL}/students/${studentId}/update-decision`, { decision });
          message.success(`Request ${decision}d successfully`);
          fetchRequests(); // Refresh list
        } catch (err) {
          message.error("Action failed");
        }
      },
    });
  };

  // Helper to flatten address for comparison
  const formatValue = (val) => {
      if (typeof val === 'object' && val !== null) {
          return `${val.street || ''}, ${val.city || ''}, ${val.state || ''} ${val.zipCode || ''}`;
      }
      return val;
  };

  // Custom Row Render to show comparison
  const expandedRowRender = (student) => {
    const changes = [];
    const pending = student.pendingUpdates;

    if (!pending) return null;

    // Compare fields to find differences
    Object.keys(pending).forEach(key => {
        // Skip internal fields
        if(key === '_id') return;

        let currentVal = student[key];
        let newVal = pending[key];

        // Handle Address Object Special Case
        if(key === 'address') {
            currentVal = formatValue(student.address);
            newVal = formatValue(pending.address);
        }

        // Only show if values are actually different (loose equality)
        // eslint-disable-next-line eqeqeq
        if (currentVal != newVal) {
            changes.push({
                field: key.toUpperCase(),
                current: currentVal || <span className="text-gray-400">Empty</span>,
                requested: <span className="text-blue-600 font-semibold">{newVal}</span>
            });
        }
    });

    if(changes.length === 0) return <p className="text-gray-500 p-4">No significant changes detected.</p>;

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 ml-10">
            <h4 className="font-bold text-gray-700 mb-3">Requested Changes:</h4>
            <Table 
                dataSource={changes} 
                pagination={false} 
                size="small"
                rowKey="field"
                className="mb-4 bg-white"
            >
                <Table.Column title="Field" dataIndex="field" />
                <Table.Column title="Current Value" dataIndex="current" />
                <Table.Column title="Requested Value" dataIndex="requested" />
            </Table>
            
            <div className="flex justify-end gap-3">
                <Button 
                    danger 
                    icon={<CloseCircleOutlined />} 
                    onClick={() => handleDecision(student._id, 'decline')}
                >
                    Decline
                </Button>
                <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    className="bg-green-600 hover:bg-green-700 border-green-600"
                    onClick={() => handleDecision(student._id, 'approve')}
                >
                    Approve Changes
                </Button>
            </div>
        </div>
    );
  };

  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
        title: 'Status',
        key: 'status',
        render: () => <Badge status="processing" text="Pending Approval" />
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
          <Space>
             <span className="text-gray-400 text-sm italic">Expand row to review</span>
          </Space>
      ),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
        <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Profile Update Requests</h1>
        </div>

        <Card className="shadow-lg rounded-2xl border-0">
            <Table
                columns={columns}
                dataSource={requests}
                rowKey="_id"
                loading={loading}
                expandable={{
                    expandedRowRender,
                    defaultExpandAllRows: true, // Automatically show changes
                    expandRowByClick: true
                }}
                locale={{ emptyText: "No pending update requests found." }}
            />
        </Card>
    </div>
  );
}

// --- 3. Main Layout Wrapper (Fixes the sidebar positioning) ---
export default function UpdateRequests() {
  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <UpdateRequestsContent />
      </main>
    </div>
  );
}