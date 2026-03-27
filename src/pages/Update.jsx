import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Spin, Alert, Row, Col, Typography, Card } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

export default function Settings() {
  const [form] = Form.useForm();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get student ID from localStorage
  const getStudentId = () => {
    const userData = localStorage.getItem('placementUser');
    if (userData) {
      try {
        return JSON.parse(userData).id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Fetch current student data
  useEffect(() => {
    const studentId = getStudentId();
    if (!studentId) {
      setError('Could not find student ID. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://placement-dashboard-u8av.onrender.com/api/students/${studentId}`);
        setStudent(response.data);
        
        // Pre-fill form with existing data
        form.setFieldsValue({
          email: response.data.email, // <--- ADDED EMAIL HERE
          phone: response.data.phone,
          cgpa: response.data.cgpa,
          activeBacklogs: response.data.activeBacklogs,
          tenthGradePercentage: response.data.tenthGradePercentage,
          twelfthGradePercentage: response.data.twelfthGradePercentage,
          resumeUrl: response.data.resumeUrl,
          street: response.data.address?.street,
          city: response.data.address?.city,
          state: response.data.address?.state,
          zipCode: response.data.address?.zipCode,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch student data.');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [form]);

  
  const onFinish = async (values) => {
    const studentId = getStudentId();
    if (!studentId) {
      setError('Session expired. Please log in again.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    // Prepare data payload
    const updateRequestData = {
      email: values.email, // <--- ADDED EMAIL TO PAYLOAD
      phone: values.phone,
      cgpa: values.cgpa,
      activeBacklogs: values.activeBacklogs,
      tenthGradePercentage: values.tenthGradePercentage,
      twelfthGradePercentage: values.twelfthGradePercentage,
      resumeUrl: values.resumeUrl,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
      }
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/students/${studentId}/request-update`,
        updateRequestData
      );
      
      setStudent(response.data); 
      setSuccess('Update request submitted! It will be applied after admin approval.');
      window.scrollTo(0, 0); // Scroll to top to see alert
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit update request.';
      setError(msg);
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 font-sans bg-white-100 min-h-screen">
      <Title level={2} className="text-gray-800 mb-6">
        Update Your Information
      </Title>

      {student?.hasPendingUpdate ? (
        <Alert
          message="Update Pending Approval"
          description="You already have an update request pending. You cannot submit a new one until your current request has been reviewed by an administrator."
          type="info"
          showIcon
          className="mb-6"
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          {error && <Alert message={error} type="error" showIcon closable className="mb-4" onClose={() => setError('')} />}
          {success && <Alert message={success} type="success" showIcon closable className="mb-4" onClose={() => setSuccess('')} />}

          <Title level={4} className="mb-4 border-b pb-2">Personal & Contact</Title>
          <Row gutter={16}>
            {/* --- ADDED EMAIL FIELD --- */}
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="student@example.com" />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input placeholder="e.g., 9876543210" />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={24}>
              <Form.Item
                label="Resume URL"
                name="resumeUrl"
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input placeholder="e.g., https://linkedin.com/in/yourprofile" />
              </Form.Item>
            </Col>
          </Row>

          <Title level={4} className="mt-6 mb-4 border-b pb-2">Address</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Street" name="street">
                <Input placeholder="Street Address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="City" name="city">
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="State" name="state">
                <Input placeholder="State" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Zip Code" name="zipCode">
                <Input placeholder="Zip Code" />
              </Form.Item>
            </Col>
          </Row>

          <Title level={4} className="mt-6 mb-4 border-b pb-2">Academic Details</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Current CGPA"
                name="cgpa"
                rules={[{ required: true, message: 'Please enter your CGPA' }]}
              >
                <Input type="number" step="0.01" min="0" max="10" placeholder="e.g., 8.5" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Active Backlogs"
                name="activeBacklogs"
                rules={[{ required: true, message: 'Enter 0 if none' }]}
              >
                <Input type="number" min="0" placeholder="e.g., 0" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="10th Grade %"
                name="tenthGradePercentage"
              >
                <Input type="number" step="0.01" min="0" max="100" placeholder="e.g., 92.5" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="12th Grade %"
                name="twelfthGradePercentage"
              >
                <Input type="number" step="0.01" min="0" max="100" placeholder="e.g., 88.0" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700"
              disabled={student?.hasPendingUpdate}
            >
              {student?.hasPendingUpdate ? 'Approval Pending' : 'Submit Update Request'}
            </Button>
          </Form.Item>
        </Form>
      )}

      
      {student?.hasPendingUpdate && student.pendingUpdates && (
        <Card title="Your Pending Update Request" className="mt-6 shadow-md border-orange-200">
          <p className="mb-4 text-gray-600">The following changes are waiting for admin approval:</p>
          <ul className="list-disc pl-5 space-y-2">
            {Object.entries(student.pendingUpdates).map(([key, value]) => {
              if (key === '_id' || key === 'address') return null;
              if (student[key] !== value) {
                return <li key={key}><Text strong className="capitalize">{key}:</Text> {String(value)}</li>;
              }
              return null;
            })}
            {student.pendingUpdates.address && Object.entries(student.pendingUpdates.address).map(([key, value]) => {
               if (key === '_id') return null;
               // Optional chaining safe check
               if (student.address?.[key] !== value) {
                 return <li key={key}><Text strong className="capitalize">Address {key}:</Text> {String(value)}</li>;
               }
               return null;
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}