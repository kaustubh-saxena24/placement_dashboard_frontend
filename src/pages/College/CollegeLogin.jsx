import { Button, Checkbox, Form, Input, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function CollegeLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError(''); 

    try {
     
      const response = await axios.post('http://localhost:5000/api/college/login', {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem('placementUser', JSON.stringify(response.data.college)); 

      
      navigate('/college-dashboard'); 

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'College login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = () => {
    navigate('/login'); 
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gray-100 p-5">
      
      
      <div className="absolute top-5 right-5">
        <Button
          type="link"
          onClick={handleStudentLogin}
          className="font-medium text-blue-700 hover:text-blue-800"
        >
          Login as Student
        </Button>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
        {/* Title */}
        <Typography.Title level={2} className="text-center text-gray-900 font-bold mb-6">
          College Placement Dashboard
        </Typography.Title>

    
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        <Form layout="vertical" className="space-y-6" onFinish={onFinish}>
          <Form.Item
            label="College Email *"
            name="email"
            rules={[
              { required: true, message: 'Please enter your college email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              placeholder="Enter your college email address"
              className="h-12 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </Form.Item>

          <Form.Item
            label="Password *"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="h-12 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>
             
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-blue-700 hover:bg-blue-800 rounded-lg font-semibold"
              loading={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}