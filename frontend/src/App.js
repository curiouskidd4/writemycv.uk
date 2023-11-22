import logo from "./logo.svg";
import React from "react";

import "./App.css";
import {
  Row,
  Col,
  Button,
  Card,
  Tag,
  Typography,
  Layout,
  Menu,
  Anchor,
  ConfigProvider,
  Spin,
} from "antd";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import remarkGfm from "remark-gfm";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";

// import ResponseForm from "./pages/responseForm";
// import Predictions from "./predictions";
import LoginSignupPage from "./pages/signInUp";
import CustomHeader from "./components/header";
import Footer from "./components/footer.jsx";
import PrivacyPolicy from "./legal/PrivacyPolicy.jsx";
// import Contact from "./communication/Contact";
import TermsService from "./legal/TermsService";
// import Payment from "./pages/subscription";
import PublicHeader from "./components/publicHeader";
import { UserContext } from "./customContext";
import { useAuth, ProviderAuth } from "./authContext";
// import ResetPasswordPage from "./pages/signInUp/resetPasswordPage";
// import ForgotPasswordConfirm from "./pages/signInUp/confirmForgotPassword";
// import ForgotPassword from "./pages/signInUp/forgotPassword";
// import SuperAdmin from "./pages/admin";
// import FinishInvite from "./pages/invite/finishInvite";
import moment from "moment";
import Resume from "./pages/resume";
import Profile from "./pages/profile";
import EditResume from "./pages/resume/editor";
import ResumePreview from "./pages/publicResume";
import LandingPage from "./pages/landing";
import CoolForm from "./pages/coolForm";
import AccountSettings from "./pages/account";
import FAQs from "./pages/faqs";
import Upgrade from "./pages/upgrade";
import UpgradeSuccess from "./pages/upgrade/success";
import UpgradeCancel from "./pages/upgrade/cancel";
import CustomerOnboarding from "./pages/onboarding";
import EmailVerification from "./pages/account/emailVerification";
import ForgotPassword from "./pages/signInUp/forgotPassword";
// import LabelHome from "./pages/others/label";
// import LabelTaskPage from "./pages/labelTask";
// import { PubmedDataItems } from "./services/dataService";
// import PubmedDataHome from "./pages/pubmedData";
// import PubmedDataSplit from "./pages/pubmedDataSplit";
// import { Header } from "antd/es/layout/layout";

const GenLayout = ({ children }) => {
  const { user } = useAuth();
  const match = useLocation();

  // regex match for "/resumes/XC6s4UR2RhXSO6zHKToS"
  let isResumeEdit = match.pathname.search(/\/resumes\/[a-zA-Z0-9]+/) == 0;
  let publicResume =
    match.pathname.search(/\/public-resume\/[a-zA-Z0-9]+/) == 0;

  return (
    <>
      {isResumeEdit || publicResume ? null : <CustomHeader />}
      <div id={isResumeEdit? "detail-large" : "detail"}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

const GenPublicLayout = ({ children }) => {
  // debugger
  const match = useLocation();

  let publicResume =
    match.pathname.search(/\/public-resume\/[a-zA-Z0-9]+/) == 0;

  return (
    <>
      {publicResume ? null : <PublicHeader />}
      <div id="public-detail">
        <Outlet />
      </div>
      <Footer />
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
      {
        path: "profile",
        element: <Profile />,
      },
      { path: "terms-service", element: <TermsService /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "cool-form", element: <CoolForm /> },
      // { path: "contact", element: <Contact /> },
      // { path: "use", element: <Help /> },
      // { path: "superadmin", element: <SuperAdmin /> },

      { path: "resumes/:resumeId", element: <EditResume /> },
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
  // {
  //   path: "/label/:id",
  //   element: <LabelHome />,
  // },
  // {
  //   path: "/label",
  //   element: <LabelTaskPage />,
  // },

  // {
  //   path: "/dataset/:id",
  //   element: <PubmedDataHome />,
  // },
  // {
  //   path: "/dataset",
  //   element: <PubmedDataSplit />,
  // },
]);

const baseRouter = createBrowserRouter([
  {
    path: "/",
    element: <GenPublicLayout />,

    children: [
      {
        path: "",
        element: (
          <div>
            <LandingPage />
          </div>
        ),
      },
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
            <ForgotPassword isSignup={true} />
          </div>
        ),
      },
      // {
      //   path: "forgot-password",
      //   element: (
      //     <div>
      //       <ForgotPassword />
      //     </div>
      //   ),
      // },
      // {
      //   path: "forgot-password-confirm",
      //   element: (
      //     <div>
      //       <ForgotPasswordConfirm />
      //     </div>
      //   ),
      // },

      // {
      //   path: "complete_invite",
      //   element: (
      //     <div>
      //       <FinishInvite />
      //     </div>
      //   ),
      // },
      { path: "terms-service", element: <TermsService /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "public-resume/:publicResumeId", element: <ResumePreview /> },

      {
        path: "*",
        element: (
          <div>
            <Navigate to="/" />
          </div>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient();

const BaseApp = () => {
  const auth = useAuth();

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
            (auth.isProfileComplete && auth.isEmailVerified ? (
              <>
                <RouterProvider router={protectedRouter} />
              </>
            ) : !auth.isEmailVerified ? (
              <>
                <EmailVerification />
              </>
            ) : !auth.isProfileComplete ? (
              <CustomerOnboarding />
            ) : null)
            }
            {
              !auth.isAuthenticated && (
                <RouterProvider router={baseRouter} />
              )
            }
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
                fontFamily: "Karla",

                colorPrimary: "#256763",
                colorTextSecondary: "#6a7991",
                colorLink: "#3B73CE",
                colorLinkHover: "#4B7FD2",
                colorLinkActive: "#3B73CE",
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
