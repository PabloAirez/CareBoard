import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import FirstAccess from '../pages/FirstAccess';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/first-access" element={<FirstAccess />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;