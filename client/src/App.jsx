import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar } from "./components";
import {
  About,
  AuthPage,
  ServiceProviders,
  FindService,
  UserProfile,
  ServiceDetail,
  UploadService,
  ServiceProviderProfile,
  Bookings
} from "./pages";
import { useSelector } from "react-redux";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();


  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/user-auth" state={{ from: location }} replace />
  );
}

function App() {
  const { user } = useSelector((state) => state.user);
  return (
    <main className='bg-[#f7fdfd]'>
    
      <Navbar />

      <Routes>
        {/* Pages accessible when authenticated*/}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to="/find-services" replace={true} />}
          />
          <Route path="/find-services" element={<FindService />} />
          <Route path="/serviceProvider" element={<ServiceProviders />} />
          <Route
            path={
              user?.accountType === "seeker"
                ? "/user-profile"
                : "/user-profile/:id"
            }
            element={<UserProfile />}
          />

          <Route path={"/serviceProvider-profile"} element={<ServiceProviderProfile />} />
          <Route path={"/serviceProvider-profile/:id"} element={<ServiceProviderProfile />} />
          <Route path={"/applications"} element={<Bookings />} />
          <Route path={"/upload-service"} element={<UploadService />} />
          <Route path={"/service-detail/:id"} element={<ServiceDetail />} />
        </Route>

        <Route path="/about-us" element={<About />} />
        <Route path="/user-auth" element={<AuthPage />} />
      </Routes>
      {/* Pages accessible when NOT authenticated*/}

      {user && <Footer />} 
      {/*Shows footer only when logged in */}
    </main>
  );
}

export default App;