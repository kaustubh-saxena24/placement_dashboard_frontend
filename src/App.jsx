import Sidebar from "./components/Sidebar.jsx"; 
import { Outlet } from "react-router-dom";
import Header from './components/Header.jsx';
import './App.css'; 
import Breadcrumbs from "./components/Breadcumbs.jsx";

export default function App() {
  return (
<div className="layout">
      <Sidebar />
      
      <div className="content-wrapper">
        <Header /> 
        <main className="content">
           <Breadcrumbs></Breadcrumbs>
          <Outlet />
        </main>
      </div>
    </div>
  );
}