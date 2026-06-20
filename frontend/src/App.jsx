import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ContentProvider } from './context/ContentContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './components/admin/Toast.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Programs from './pages/Programs.jsx';
import ProgramDetail from './pages/ProgramDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import Articles from './pages/Articles.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Achievements from './pages/Achievements.jsx';
import JoinUs from './pages/JoinUs.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import ProtectedRoute from './pages/admin/ProtectedRoute.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManagePrograms from './pages/admin/ManagePrograms.jsx';
import ManageArticles from './pages/admin/ManageArticles.jsx';
import ManageGallery from './pages/admin/ManageGallery.jsx';
import ManageContacts from './pages/admin/ManageContacts.jsx';
import ManageContent from './pages/admin/ManageContent.jsx';
import ManageAchievements from './pages/admin/ManageAchievements.jsx';
import ManageVolunteers from './pages/admin/ManageVolunteers.jsx';

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <ContentProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:slug" element={<ProgramDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="programs" element={<ManagePrograms />} />
          <Route path="articles" element={<ManageArticles />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route path="achievements" element={<ManageAchievements />} />
          <Route path="volunteers" element={<ManageVolunteers />} />
          <Route path="content" element={<ManageContent />} />
        </Route>
          </Routes>
        </ToastProvider>
      </ContentProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
