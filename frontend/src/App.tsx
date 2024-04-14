import React from "react";

import "./App.css";
import { ConfigProvider, Row, Spin } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";

import LoginSignupPage from "./pages/signInUp/index.js";
import CustomHeader from "./components/header.js";
import Footer from "./components/Footer.jsx";
import PrivacyPolicy from "./legal/PrivacyPolicy.jsx";
// import Contact from "./communication/Contact";
import TermsService from "./legal/TermsService.jsx";
// import Payment from "./pages/subscription";
import PublicHeader from "./components/publicHeader.js";
import { useAuth, ProviderAuth } from "./contexts/authContext.js";

import moment from "moment";
import Resume from "./pages/allResume/index";
import Profile from "./pages/profile/index.js";
import EditResume from "./pages/allResume/editor/index.js";
import ResumePreview from "./pages/old/publicResume/index.js";
import LandingPage from "./pages/landing/index.js";
// import CoolForm from "./pages/coolForm/index.js";
import AccountSettings from "./pages/account/index.js";
import FAQs from "./pages/faqs/index.js";
import Upgrade from "./pages/upgrade/index.js";
import UpgradeSuccess from "./pages/upgrade/success.js";
import UpgradeCancel from "./pages/upgrade/cancel.js";
import CustomerOnboarding from "./pages/onboarding/index.js";
import EmailVerification from "./pages/account/emailVerification.js";
import ForgotPassword from "./pages/signInUp/forgotPassword.js";
import ResumeEditV2 from "./resume";
import ResumePreviewV2 from "./resumePreview";
import ProfileV2 from "./profile";
import Sider from "./components/sider";
import ImportCVToProfile from "./importCV";
import FirebaseUserMangement from "./userManagement";
import "./design.css";
import { PremiumUpgradeComponent } from "./components/paywall";

const GenLayout = ({}) => {
  const { user } = useAuth();
  const match = useLocation();

  // regex match for "/resumes/XC6s4UR2RhXSO6zHKToS"
  let isResumeEdit = match.pathname.search(/\/resumes\/[a-zA-Z0-9]+/) == 0;
  let publicResume =
    match.pathname.search(/\/public-resume\/[a-zA-Z0-9]+/) == 0;

  return (
    <div className="body">
      {publicResume ? null : <CustomHeader />}
      <div className="layout">
        {/* <Sider /> */}
        <div id={isResumeEdit ? "detail-large" : "detail"}>
          <div className="outlet">
            <Outlet />
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};

const GenPublicLayout = ({ showSigninButtons = true }) => {
  // debugger
  const match = useLocation();

  let hideNavBar =
    match.pathname.search(/\/public-resume\/[a-zA-Z0-9]+/) == 0 ||
    match.pathname.search(/\/(signin|signup|forgot-password)/) == 0;

  let hideFooter =
    match.pathname.search(/\/public-resume\/[a-zA-Z0-9]+/) == 0 ||
    match.pathname.search(/\/(signin|signup|forgot-password)/) == 0;

  return (
    <>
      {hideNavBar ? null : (
        <PublicHeader showSignInButtons={showSigninButtons} />
      )}
      <div id="public-detail">
        <Outlet />
      </div>
      {hideFooter ? null : <Footer />}
    </>
  );
};
const protectedRouter = createBrowserRouter([
  {
    path: "/",
    element: <GenLayout />,

    children: [
      {
        path: "",
        element: <Navigate to="/resumes" />,
      },
      {
        path: "resumes",
        element: <Resume />,
      },
      // {
      //   path: "repository",
      //   element: <Profile />,
      // },
      {
        path: "repository",
        element: <ProfileV2 />,
      },
      {
        path: "profile-v2",
        element: <ProfileV2 />,
      },
      { path: "terms-service", element: <TermsService /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      // { path: "cool-form", element: <CoolForm /> },
      // { path: "contact", element: <Contact /> },
      // { path: "use", element: <Help /> },
      // { path: "superadmin", element: <SuperAdmin /> },

      // { path: "resumes/:resumeId", element: <EditResume /> },
      { path: "resumes/:resumeId/edit", element: <ResumeEditV2 /> },
      { path: "resumes/:resumeId", element: <ResumePreviewV2 /> },

      { path: "public-resume/:publicResumeId", element: <ResumePreview /> },

      {
        path: "faq",
        element: <FAQs />,
      },
      {
        path: "upgrade",
        element: <Upgrade />,
      },
      {
        path: "upgrade/success",
        element: <UpgradeSuccess />,
      },
      {
        path: "upgrade/cancel",
        element: <UpgradeCancel />,
      },
      {
        path: "account",
        element: <AccountSettings />,
      },
      {
        path: "/*",
        element: (
          <div>
            <Navigate to="/resumes" />
          </div>
        ),
      },
    ],
  },
]);

const verificationRouter = createBrowserRouter([
  {
    path: "/",
    element: <GenPublicLayout showSigninButtons={false} />,

    children: [
      {
        path: "usermgmt",
        // element: <AccountSettings />,
        element: <FirebaseUserMangement />,
      },

      {
        path: "verification",
        // element: <AccountSettings />,
        element: <EmailVerification />,
      },
      {
        path: "*",
        element: (
          <div>
            <Navigate to="/verification" />
          </div>
        ),
      },
      {
        path: "",
        element: (
          <div>
            <Navigate to="/verification" />
          </div>
        ),
      },
    ],
  },
]);

const baseRouter = createBrowserRouter([
  {
    path: "/",
    element: <GenPublicLayout />,

    children: [
      // {
      //   path: "",
      //   element: (
      //     <div>
      //       <LandingPage />
      //     </div>
      //   ),
      // },
      {
        path: "signin",
        element: (
          <div>
            <LoginSignupPage isSignup={false} />
          </div>
        ),
      },
      {
        path: "signup",
        element: (
          <div>
            <LoginSignupPage isSignup={true} />
          </div>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <div>
            <ForgotPassword />
          </div>
        ),
      },
      {
        path: "usermgmt",
        element: (
          <div>
            <FirebaseUserMangement />
          </div>
        ),
      },

      { path: "terms-service", element: <TermsService /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "public-resume/:publicResumeId", element: <ResumePreview /> },

      {
        path: "*",
        element: (
          <div>
            <Navigate to="/signin" />
          </div>
        ),
      },
      {
        path: "",
        element: (
          <div>
            <Navigate to="/signin" />
          </div>
        ),
      },
    ],
  },
]);

const importRouter = createBrowserRouter([
  {
    path: "/",
    element: <GenLayout />,

    children: [
      {
        path: "*",
        element: <ImportCVToProfile />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

const BaseApp = () => {
  const auth = useAuth();

  console.log("USER", auth.user);
  return (
    <React.StrictMode>
      {auth.loading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          {auth.isAuthenticated &&
            auth.user &&
            (auth.isEmailVerified && auth.isRepoCompleted && auth.subscriptionId ? (
              // (auth.isProfileComplete && auth.isEmailVerified  ? (

              <>
                <RouterProvider router={protectedRouter} />
              </>
            ) : !auth.isEmailVerified ? (
              <>
                <RouterProvider router={verificationRouter} />
              </>
            ) : // : !auth.isProfileComplete ? (
            //   <CustomerOnboarding />
            // )
            !auth.subscriptionId ? (
              <PremiumUpgradeComponent enabled={true} />
            ) : !auth.isRepoCompleted ? (
              <RouterProvider router={importRouter} />
            ) : null)}
          {!auth.isAuthenticated && <RouterProvider router={baseRouter} />}
        </>
      )}
    </React.StrictMode>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ProviderAuth>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: "DM Sans",

                colorPrimary: "#37FDAA",
                colorTextSecondary: "#6a7991",
                colorLink: "#3B73CE",
                colorLinkHover: "#4B7FD2",
                colorLinkActive: "#3B73CE",
                borderRadius: 12,
                // boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.1)",
                // boxShadowSecondary: "0px 0px 0px 0px rgba(0,0,0,0.1)",
                // boxShadowTertiary: "0px 0px 0px 0px rgba(0,0,0,0.1)",

                // colorPrimary: "#0081a7",
                // colorTextSecondary: "#93F5F6",
                // colorLink: "#0081a7",
                // colorLinkHover: "#003560",
                // colorLinkActive: "#003560",
                // colorText: "#003560",
              },
            }}
          >
            <BaseApp />
          </ConfigProvider>
        </ProviderAuth>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
