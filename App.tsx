
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/Home';
import CoachingPage from './pages/Coaching';
import CommunityPage from './pages/Community';
import ProfilePage from './pages/Profile';
import CertificatePage from './pages/Certificate';
import RankingPage from './pages/Ranking';
import NotificationsPage from './pages/Notifications';
import SettingsPage from './pages/Settings';
import CoachingChatPage from './pages/CoachingChat';
import CourseDetailPage from './pages/CourseDetail';
import CoachingDirectoryPage from './pages/CoachingDirectory';
import ExplorePage from './pages/Explore';
import EditProfilePage from './pages/EditProfile';
import EditSkillsPage from './pages/EditSkills';
import BadgesPage from './pages/Badges';
import CategoryPage from './pages/Category';
import MentorProfilePage from './pages/MentorProfile';
import MyListPage from './pages/MyList';
import CalendarPage from './pages/Calendar';
import ServicesHubPage from './pages/ServicesHub';
import DailyDosePage from './pages/DailyDose';
import BadgeCelebration from './components/BadgeCelebration';
import GlobalToast from './components/GlobalToast';

const App: React.FC = () => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <HashRouter>
            <div className="font-display">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/my-list" element={<MyListPage />} />
                    <Route path="/services" element={<ServicesHubPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/coaching" element={<CoachingPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Secondary Routes */}
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/certificate" element={<CertificatePage />} />
                    <Route path="/ranking" element={<RankingPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/coaching-chat" element={<CoachingChatPage />} />
                    <Route path="/course-detail" element={<CourseDetailPage />} />
                    <Route path="/coaching-directory" element={<CoachingDirectoryPage />} />
                    <Route path="/mentor-profile/:id" element={<MentorProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfilePage />} />
                    <Route path="/edit-skills" element={<EditSkillsPage />} />
                    <Route path="/badges" element={<BadgesPage />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    <Route path="/daily-dose" element={<DailyDosePage />} />
                </Routes>
                
                {/* Overlay de celebración global */}
                <BadgeCelebration />
                
                {/* Sistema global de notificaciones toast */}
                <GlobalToast />
            </div>
        </HashRouter>
    );
};

export default App;
