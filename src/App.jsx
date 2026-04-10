import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";

// Public
import PublicLayout  from "./components/layout/PublicLayout";
import Home          from "./pages/Home";
import Works         from "./pages/Works";
import ServicesPage  from "./pages/ServicesPage";
import BlogList      from "./pages/BlogList";
import BlogPost      from "./pages/BlogPost";
import ResumePage    from "./pages/ResumePage";
import ContactPage   from "./pages/ContactPage";
import TermsPage     from "./pages/TermsPage";
import PrivacyPage   from "./pages/PrivacyPage";

// Admin
import AdminLogin    from "./admin/pages/AdminLogin";
import AdminLayout   from "./admin/components/AdminLayout";
import Dashboard     from "./admin/pages/Dashboard";
import AProfile      from "./admin/pages/AProfile";
import AProjects     from "./admin/pages/AProjects";
import AServices     from "./admin/pages/AServices";
import ABlogs        from "./admin/pages/ABlogs";
import AResume       from "./admin/pages/AResume";
import ATestimonials from "./admin/pages/ATestimonials";
import AMessages     from "./admin/pages/AMessages";
import ASettings     from "./admin/pages/ASettings";
import ASEO          from "./admin/pages/ASEO";
import ALegal        from "./admin/pages/ALegal";

function Guard({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
      height:"100vh", background:"var(--bg)", color:"var(--text3)" }}>Loading…</div>
  );
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/works"       element={<Works />} />
        <Route path="/services"    element={<ServicesPage />} />
        <Route path="/blog"        element={<BlogList />} />
        <Route path="/blog/:slug"  element={<BlogPost />} />
        <Route path="/resume"      element={<ResumePage />} />
        <Route path="/contact"     element={<ContactPage />} />
        <Route path="/terms"       element={<TermsPage />} />
        <Route path="/privacy"     element={<PrivacyPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Guard><AdminLayout /></Guard>}>
        <Route index               element={<Dashboard />} />
        <Route path="profile"      element={<AProfile />} />
        <Route path="projects"     element={<AProjects />} />
        <Route path="services"     element={<AServices />} />
        <Route path="blogs"        element={<ABlogs />} />
        <Route path="resume"       element={<AResume />} />
        <Route path="testimonials" element={<ATestimonials />} />
        <Route path="messages"     element={<AMessages />} />
        <Route path="settings"     element={<ASettings />} />
        <Route path="seo"          element={<ASEO />} />
        <Route path="legal"        element={<ALegal />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
