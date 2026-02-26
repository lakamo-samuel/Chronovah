import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./index.css";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./pages/ProtectedRoute";
import Spinner from "./ui/Spinner";
import PlaceDetail from "./features/Places/PlaceDetail";
import JournalDetail from "./features/Journal/JournalDetail";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Note = lazy(() => import("./pages/Note"));
const NoteDetail = lazy(() => import("./features/Note/NoteDetail"));
const Journal = lazy(() => import("./pages/Journal"));
const Places = lazy(() => import("./pages/Places"));
const People = lazy(() => import("./pages/People"));
const Setting = lazy(() => import("./pages/Setting"));
const ProfileSetting = lazy(() => import("./pages/ProfileSetting"));
const ItemDetails = lazy(() => import("./ui/ItemDetails"));
const Homepage = lazy(() => import("./pages/Homepage"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgetPassword"));
const OtpVerification = lazy(() => import("./pages/OTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <Spinner size="lg" overlay={true} color="blue-500" thickness={4} />
        }
      >
        <Routes>
          <Route index path="/" element={<Homepage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notes" element={<Note />} />
            <Route path="notes/:id" element={<NoteDetail />} /> {/* Add this */}
            <Route path="journal" element={<Journal />} />
            <Route path="journal/:id" element={<JournalDetail />} />
            <Route path="places" element={<Places />} />
            // In your routes, add:
            <Route path="places/:id" element={<PlaceDetail />} />
            <Route path="people" element={<People />} />
            <Route path="settings" element={<Setting />} />
            <Route path="settings/profile" element={<ProfileSetting />} />
            <Route path="item/:type/:id" element={<ItemDetails />} />
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/otpverification" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
