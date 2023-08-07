import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

export interface Token {
  access: string;
  refresh: string;
}

export interface AuthState {
  authTokens: Token | null;
  loading: boolean;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => Promise<void>;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  username: string;
}

const defautlState: AuthState = {
  authTokens: null,
  loading: true,
  logout: () => {},
  register: async () => {},
  login: async () => {},
  username: "",
};

const AuthContext = createContext<AuthState>(defautlState);

export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [authTokens, setAuthTokens] = useState<Token | null>({
    access: "",
    refresh: "",
  });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    setLoading(true);
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data: Token = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setLoading(false);
      setUsername(username);
      localStorage.setItem("authTokens", JSON.stringify(data));
      router.push("/");
    } else {
      setUsername("");
      console.error(response.status);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => {
    setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        password2: password2,
      }),
    });

    if (response.status === 200) {
      const data: Token = await response.json();
      const decode: any = jwt_decode(data.access);
      setAuthTokens(data);
      setLoading(false);
      setUsername(decode.username);
      localStorage.setItem("authTokens", JSON.stringify(data));
      router.push("/");
    } else {
      setUsername("");
      console.error(response.status);
    }
  };

  const logout = () => {
    setAuthTokens({ access: "", refresh: "" });
    setUsername("");
    router.push("/");
  };

  let updateToken = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUsername(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logout();
    }

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading && authTokens?.refresh !== "") {
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 4;

    let interval = setInterval(() => {
      if (authTokens?.refresh !== '') {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const contextData = {
    authTokens,
    loading,
    logout,
    register,
    login,
    username,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
