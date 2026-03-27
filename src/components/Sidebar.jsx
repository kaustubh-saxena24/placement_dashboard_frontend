import { NavLink, useNavigate } from "react-router-dom";
import { Search, LogOut, BarChart2, Calendar, Building, Settings, HelpCircle } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    navigate("/login");
  }

  const platformLinks = [
    { to: "/analytics", icon: <BarChart2 size={20} />, text: "Analytics" },
    { to: "/search", icon: <Search size={20} />, text: "Student Search" },
    { to: "/schedule", icon: <Calendar size={20} />, text: "Schedules" },
    
    { to: "/Update", icon: <Settings size={20} />, text: "Update" },
  ];

  const helpLinks = [{ to: "/contact-info", icon: <HelpCircle size={20} />, text: "Contact Info" }];

  return (
    <aside className="w-[20%] max-w-64 min-w-48 h-screen bg-white flex flex-col justify-between border-r border-gray-200">
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <NavLink to ={'/'}> <h1 className="text-xl font-bold text-blue-500">Placement</h1></NavLink>
        
      </div>

     
      <nav className="flex-1 p-6">
        <p className="px-4 text-xs text-gray-500 uppercase tracking-wide">Platform</p>
        {platformLinks.map((link) => (
          <SidebarItem key={link.to} to={link.to} icon={link.icon} text={link.text} />
        ))}

        <p className="px-4 mt-8 text-xs text-gray-500 uppercase tracking-wide">Help</p>
        {helpLinks.map((link) => (
          <SidebarItem key={link.to} to={link.to} icon={link.icon} text={link.text} />
        ))}
      </nav>

     
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
