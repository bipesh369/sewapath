import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Eligibility from "./pages/Eligibility";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Navigate to="/services" replace />}
        />

        {/* Services list */}
        <Route
          path="/services"
          element={<Services />}
        />

        {/* Service details */}
        <Route
          path="/services/:id"
          element={<ServiceDetails />}
        />

        {/* Eligibility */}
        <Route
          path="/services/:id/eligibility"
          element={<Eligibility />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;