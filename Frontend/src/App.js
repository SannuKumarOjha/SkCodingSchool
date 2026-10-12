import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Layout";
import "./App.css";
import Practice from "./Pages/Practice";
import DSA from "./Pages/DSA";
import Courses from "./Pages/Courses";
import Login from "./Pages/LoginAuth/Login";
import SignUp from "./Pages/LoginAuth/SignUp";
import ForgotPassword from "./Pages/LoginAuth/ForgotPassword";
import PageNotFound from "./Pages/PageNotFound";
import YtVideo from "./Pages/YouTubeAPI/YtVideo";
import Html from "./Pages/PracticeItems/HTML/Html";
import Css from "./Pages/PracticeItems/CSS/Css";
import RGPV from "./Pages/RgpvNotes/MainRgpv";
import Branch from "./Pages/RgpvNotes/Branch"
import CSE from "./Pages/RgpvNotes/NotesPages/CSE";
import HelpInInterview from "./Pages/HelpInInterview";
import Verify from "./Pages/LoginAuth/Verify";
import ProtectedRoute from "./Pages/components/ProtectedRoutes";
import HtmlIntro from "./Pages/PracticeItems/HTML/Topics/htmlIntro";
import Chatbot from "./Pages/components/Chatbot";
import Loader from "./Pages/Loader/Loader";
import Profile from "./Pages/Profile/Profile";
import { useUser } from "./Pages/Navbar/context/userContext";
import { getReadingLesson } from "./data/readingLessons";
import api from "./api";

const App = () => {
  const location = useLocation();
  const { user, setUser } = useUser();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const lesson = getReadingLesson(location.pathname);
    const token = localStorage.getItem("token");
    if (!user?._id || !lesson || !token) return;

    api.post(
      "/user/progress",
      { lessonId: lesson.id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(({ data }) => {
        setUser((currentUser) => {
          if (!currentUser) return currentUser;
          const updatedUser = {
            ...currentUser,
            readingProgress: data.readingProgress,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return updatedUser;
        });
      })
      .catch((error) => {
        console.error("Could not save reading progress:", error);
      });
  }, [location.pathname, setUser, user?._id]);

  useEffect(() => {
    const visited = localStorage.getItem("visited");

    if (!visited) {
      setLoading(true);
    }
  }, []);

  const handleLoaderFinish = () => {
    localStorage.setItem("visited", "true");
    setLoading(false);
  };

  if (loading) {
    return <Loader onFinish={handleLoaderFinish} />;
  }

  return (
    <>
      <div className={`container-fluid ${theme}`}>
        <Routes>
          <Route
            path="/"
            element={<Layout theme={theme} setTheme={setTheme} />}
          >
            <Route index element={<Home />} />
            <Route path="/main" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/DSA-sheet" element={<ProtectedRoute><DSA /></ProtectedRoute>} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            {/* Login | Signup | Verify Routes */}

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<Verify />} />

            <Route path="/ytvideo" element={<YtVideo />} />
            <Route path="/rgpv-notes" element={<ProtectedRoute><RGPV /></ProtectedRoute>} />
            <Route
              path="/rgpv-notes/rgpv-notes&shivani"
              element={<Branch />}
            />
            <Route
              path="/rgpv-notes/rgpv-notes&shivani/cse"
              element={<CSE headline="Welcome To CSE Branch" />}
            />
            <Route path="*" element={<PageNotFound />} />
            {/* <Route path="/practice/html/html-home" element={<Html />} /> */}
            <Route path="/practice/css-full-course" element={<Css />} />
            <Route path="/rgpv-placement" element={<HelpInInterview />} />

            {/* HTML All  */}

            <Route path="/practice/html/html-home" element={<ProtectedRoute><Html /></ProtectedRoute>} />
            <Route path="/practice/html/html-introduction" element={<HtmlIntro />} />
            <Route path="/practice/html/html-basic" element={<Html />} />
            <Route path="/practice/html/html-editors" element={<Html />} />
            <Route path="/practice/html/html-elements" element={<Html />} />
            <Route path="/practice/html/html-attributes" element={<Html />} />
            <Route path="/practice/html/html-headings" element={<Html />} />
            <Route path="/practice/html/html-paragraphs" element={<Html />} />
            <Route path="/practice/html/html-styles" element={<Html />} />
            <Route path="/practice/html/html-formattings" element={<Html />} />
          </Route>
        </Routes>
        <Chatbot />
      </div>
    </>
  );
};

export default App;
