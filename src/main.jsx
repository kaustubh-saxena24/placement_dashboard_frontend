import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { App } from 'antd'
import 'antd/dist/reset.css'


import MyApp from './App.jsx' 
import './index.css'
import LoginPage from './pages/LoginPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import Home from './pages/HomePage.jsx'
import { Analytics } from './pages/Analytics.jsx'
import Update from './pages/Update.jsx'
import Schedule from './pages/Schedule.jsx'
import ContactInfo from './pages/ContactInfor.jsx'
import CollegeLoginPage from './pages/College/CollegeLogin.jsx'
import CollegeDashboard from './pages/College/CollegeDashboard.jsx'
import PostJobPage from './pages/College/JobPost.jsx'
import AddStudentPage from './pages/College/AddStudent.jsx'
import ViewApplications from './pages/College/ViewApplication.jsx'
import UpdateRequests from './pages/College/UpdateRequests.jsx'
import MarkPlaced from './pages/College/MarkPlaced.jsx'
import '@ant-design/v5-patch-for-react-19';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      
      <App>
        <Routes>
          
          <Route path="/college-login" element={<CollegeLoginPage />} />
          <Route path="/college-dashboard" element={<CollegeDashboard />} />
          <Route path="/JobPost" element={<PostJobPage />} />
          <Route path="/AddStudent" element={<AddStudentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/view-applications" element={<ViewApplications />} />
          <Route path="/update-requests" element={<UpdateRequests />} />
          <Route path="/mark-placed" element={<MarkPlaced />} />
          
          <Route path="/" element={<MyApp />}> 
            <Route index element={<Navigate to="home" replace />} /> 
            
            <Route path='home' element={<Home></Home>}></Route>
            <Route path="analytics" element={<Analytics />} />
            <Route path="update" element={<Update />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="contact-info" element={<ContactInfo />} />
          </Route>
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>,
)