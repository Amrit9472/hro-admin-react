import React, { useState } from "react";
import "./css/SideNave.css";
import ProfileScreeningPage from "../components/ProfileScreeningPage";
import ScheduleInterview from "./ScheduleInterview";
import ManagerPageOnRoleType from "./ManagerPageOnRoleType";
import RejectedEmployeesTable from "./RejectedEmployeeTable";
import ProfileScreeningRejectedTable from "./ProfileScreeningRejectedTable";
import { useAuth } from "../components/AuthProvider";
import SelectedEmployeesTable from "./SelectedEmployeesTable";
import RegisterForm from "./RegisterForm";
import LoiDropdownForm from "./LoiDropdownForm";

const SideNav = ({ selectedItem }) => {
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState(null);
  const [componentKey, setComponentKey] = useState(0);
  let sideItems = [];

  switch (selectedItem) {
    case "Interview":
      sideItems = [
        "Screening",
        "Schedule Interview",
        "Rejected",
        "Selected",
        "HR Rejected",
        "Dash Board",
      ];
      break;
    case "Interview Schedule":
      sideItems = ["Interviews"];
      break;
    case "User Management":
      sideItems = ["Access", "Search User",
        "Report Download","Loi"];
      break;
    case "Profile":
      sideItems = ["Edit Profile", "Account Settings"];
      break;
    case "Training Programs":
      sideItems = ["Create Training", "View Participants"];
      break;
    case "Payroll Reports":
      sideItems = ["View Salary", "Generate Reports"];
      break;
    default:
      sideItems = ["Default Option 1", "Default Option 2"];
      break;
  }

  const handleClick = (item) => {
    if (activeItem === item) {
      setComponentKey(prev => prev + 1);
    } else {
      setActiveItem(item);
      setComponentKey(0);
    }

  };


  const renderComponent = (item) => {
    switch (item) {
      case "Screening":
        return <ProfileScreeningPage />;
      case "Schedule Interview":
        return <ScheduleInterview />;
      case "Interviews":
        return <ManagerPageOnRoleType />;
      case "Rejected":
        return <RejectedEmployeesTable />;
      case "HR Rejected":
        return <ProfileScreeningRejectedTable />;
      case "Selected":
        return <SelectedEmployeesTable />
      case "Access":
        return <RegisterForm />;
      case "Loi":
        return <LoiDropdownForm/>;
      default:
    }
  };

  return (
    <div className="app-loyout">
      <div className="side-nav">
        <div className="side-nav-header">
          <div className="user-info">
            <label className="user-name">Name : {user.name}</label>
            <label className="user-email">Emp Id :{user?.email}</label>
            <label className="user-email">Work location : {user?.city}</label>
          </div>
        </div>

        <div className="side-nav-items">
          {sideItems.map((item) => (
            <div
              key={item}
              className={`side-nav-item ${activeItem === item ? "active" : ""}`}
              onClick={() => handleClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {activeItem ? (
          <div key={`${activeItem}-${componentKey}`}> {/* 🔥 This forces re-render */}
            {renderComponent(activeItem)}
          </div>
        ) : (
          <div>Select an option to view content.</div>
        )}
      </div>
    </div>
  );
};
export default SideNav;
