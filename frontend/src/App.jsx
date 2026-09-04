import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Eligibility from "./pages/Eligibility";
import Journey from "./pages/Journey";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ApplicationJourney from "./pages/ApplicationJourney";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminServices from "./pages/admin/AdminServices";
import AdminServiceDetail from "./pages/admin/AdminServiceDetail";
import AdminOffices from "./pages/admin/AdminOffices";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-2xl">Page not found</h1>
      <p className="text-ink/60">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/services/:id/eligibility" element={<Eligibility />} />
        <Route path="/services/:id/journey" element={<Journey />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* The personalized "goal" journey has its own minimal header, so it
          sits outside both PublicLayout and AppShell — but still requires
          login since it's tied to a specific citizen's Application. */}
      <Route
        path="/applications/:id"
        element={
          <ProtectedRoute>
            <ApplicationJourney />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppShell role="user" />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route
        element={
          <ProtectedRoute adminOnly>
            <AppShell role="admin" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminApplications />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/services/:id" element={<AdminServiceDetail />} />
        <Route path="/admin/offices" element={<AdminOffices />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
