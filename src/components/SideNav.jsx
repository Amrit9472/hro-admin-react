import React, { useState } from 'react';
import './css/SideNave.css';
import ProfileScreeningPage from '../components/ProfileScreeningPage';
import ScheduleInterview from './ScheduleInterview';
import ManagerPageOnRoleType from './ManagerPageOnRoleType';
import RejectedEmployeesTable from './RejectedEmployeeTable';

const SideNav = ({ selectedItem }) => {
  const [componentToRender, setComponentToRender] = useState(null);
  let sideItems = [];

  switch (selectedItem) {
    case 'Interview':
      sideItems = ['Profile', 'Screening', 'Schedule Interview', 'Rejected', 'Selected', 'Hr Rejected', 'Register User', 'Search User', 'Dash Board', 'Report Download'];
      break;
    case 'Interview Schedule':
      sideItems = ['Interviews', 'View Employees'];
      break;
    case 'Team Management':
      sideItems = ['Manage Teams', 'View Progress', 'Updates'];
      break;
    case 'Profile':
      sideItems = ['Edit Profile', 'Account Settings'];
      break;
    case 'Training Programs':
      sideItems = ['Create Training', 'View Participants'];
      break;
    case 'Payroll Reports':
      sideItems = ['View Salary', 'Generate Reports'];
      break;
    default:
      sideItems = ['Default Option 1', 'Default Option 2'];
      break;
  }

  const renderComponent = (item) => {
    switch (item) {
      case 'Screening':
        return <ProfileScreeningPage />;
      case 'Schedule Interview':
        return <ScheduleInterview />;
      case 'Interviews':
        return <ManagerPageOnRoleType/>
      case 'Rejected':
        return <RejectedEmployeesTable/>
        default:
    }
  };

  return (
<div className="side-nav">
<div className="side-nav-items">
  {sideItems.map((item) => (
    <div
      key={item}
      className="side-nav-item"
      onClick={() => setComponentToRender(renderComponent(item))}
    >
      {item}
    </div>
  ))}
</div>
<div className="side-nav-content">
  {componentToRender || <div>Select an option to view content.</div>}
</div>
</div>
);
};
export default SideNav;