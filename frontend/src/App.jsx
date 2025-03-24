import { useEffect } from "react";
import { Navbar } from "./components";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Home, Login, Profile, Settings, SignUp } from "./pages";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!authUser && isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            exact
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/sign-up"
            element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/settings"
            element={authUser ? <Settings /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to={"/login"} />}
          />
        </Routes>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
