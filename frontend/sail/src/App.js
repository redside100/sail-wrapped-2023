import React from "react";
import { useEffect, useState, createContext } from "react";
import MainView from "./MainView";
import { getInfo, login, logout, refreshToken } from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export const UserContext = createContext();

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#40444b",
    },
  },
  typography: {
    fontFamily: "Nunito",
    color: "#ffffff",
    button: {
      textTransform: "none",
      color: "#ffffff",
    },
  },
});

const App = () => {
  const [userState, setUserState] = useState({});
  useEffect(() => {
    const auth = async () => {
      // previous session
      const token = localStorage.getItem("access_token");
      const localRefreshToken = localStorage.getItem("refresh_token");
      if (token) {
        setUserState({
          loggedIn: false,
          isLoading: true,
        });
        const res = await getInfo(token);
        if (res.status === "ok") {
          setUserState({
            loggedIn: true,
            isLoading: false,
            ...res,
          });
        } else {
          // try refreshing token
          setUserState({
            loggedIn: false,
            isLoading: true,
          });
          const res = await refreshToken(localRefreshToken);
          if (res.status === "ok") {
            setUserState({
              loggedIn: true,
              isLoading: false,
              ...res,
              access_token: undefined,
              refresh_token: undefined,
            });
            localStorage.clear();
            localStorage.setItem("access_token", res.access_token);
            localStorage.setItem("refresh_token", res.refresh_token);
          } else {
            localStorage.clear();
            setUserState({
              loggedIn: false,
              isLoading: false,
            });
            toast.error(res.reason, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
        return;
      }

      // check for code from oauth2 redirect
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code != null) {
        window.history.replaceState(null, null, "/");
        setUserState({
          loggedIn: false,
          isLoading: true,
        });
        const res = await login(code);
        if (res.status === "ok") {
          setUserState({
            loggedIn: true,
            isLoading: false,
            ...res,
            access_token: undefined,
            refresh_token: undefined,
          });
          localStorage.setItem("access_token", res.access_token);
          localStorage.setItem("refresh_token", res.refresh_token);
          toast.success(`Logged in as ${res.user?.global_name}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setUserState({
            loggedIn: false,
            isLoading: false,
          });
          toast.error(res.reason, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    };
    auth();
  }, []);

  const onLogout = async () => {
    setUserState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    await logout(userState.token);
    localStorage.clear();
    setUserState({
      loggedIn: false,
      isLoading: false,
    });
  };

  return (
    <UserContext.Provider value={userState}>
      <ThemeProvider theme={darkTheme}>
        <ToastContainer />
        <CssBaseline />
        <MainView onLogout={onLogout} />
      </ThemeProvider>
    </UserContext.Provider>
  );
};

export default App;
