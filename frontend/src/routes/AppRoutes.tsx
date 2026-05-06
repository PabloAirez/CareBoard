import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import FirstAccess from '../pages/FirstAccess';
import SelectUnit from '../pages/SelectUnit';
import Dashboard from '../pages/Dashboard';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/first-access" element={<FirstAccess />} />
        <Route path="/select-unit" element={<SelectUnit />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;