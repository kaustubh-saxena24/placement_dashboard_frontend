

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumbs = () => {
  const location = useLocation();
  let currentLink = '';

  
  const crumbs = location.pathname.split('/')
    .filter(crumb => crumb !== '' && crumb.toLowerCase() !== 'home');

  if (crumbs.length === 0) {
    return (
      <nav >
        <span className="text-sm font-semibold text-gray-800">Home</span>
      </nav>
    );
  }


  return (
    <nav className=" flex items-center text-sm font-medium text-gray-500">
      <Link to="/" className="hover:text-gray-800">Home</Link>
      {crumbs.map((crumb, index) => {
        currentLink += `/${crumb}`;
        const crumbText = crumb.charAt(0).toUpperCase() + crumb.slice(1);
        const isLastCrumb = index === crumbs.length - 1;

        return (
          <div key={crumb} className="flex items-center">
            <FiChevronRight className="mx-2 h-4 w-4" />
            <Link
              to={currentLink}
              className={`${isLastCrumb ? 'text-gray-800 font-semibold' : 'hover:text-gray-800'}`}
              
              onClick={(e) => isLastCrumb && e.preventDefault()}
              style={{ cursor: isLastCrumb ? 'default' : 'pointer' }}
            >
              {crumbText}
            </Link>
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;