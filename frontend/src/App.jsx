import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Eligibility from "./pages/Eligibility";

import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />

        <Route path="/services" element={<Services />} />

        <Route path="/services/:id" element={<ServiceDetails />} />
      </Routes>

      <Route path="/services/:id/eligibility"
         element={<Eligibility />}/>
    </BrowserRouter>
  );
}

export default App;