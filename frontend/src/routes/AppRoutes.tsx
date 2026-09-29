import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import FirstAccess from '../pages/FirstAccess';
import SelectUnit from '../pages/SelectUnit';
import Dashboard from '../pages/Dashboard';
import Patient from '../pages/Patient';
import Higienizacao from '../pages/Higienizacao';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/first-access" element={<FirstAccess />} />
          <Route path="/select-unit" element={<SelectUnit />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/higienizacao" element={<Higienizacao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
