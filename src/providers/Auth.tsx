import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
  } from "react";
  
  import { api } from "../services/api";
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  interface User {
    email: string;
    id: string;
    name: string;
  }
  
  interface AuthState {
    accessToken: string;
    user: User;
  }
  
  interface SignInCredentials {
    email: string;
    password: string;
  }
  
  interface AuthContextData {
    user: User;
    accessToken: string;
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => void;
  }
  
  const AuthContext = createContext<AuthContextData>({} as AuthContextData);
  
  const useAuth = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
  
    return context;
  };
  
  const AuthProvider = ({ children }: AuthProviderProps) => {
    const [data, setData] = useState<AuthState>(() => {
      const accessToken = localStorage.getItem("@Ber:accessToken");
      const user = localStorage.getItem("@Ber:user");
  
      if (accessToken && user) {
        return { accessToken, user: JSON.parse(user) };
      }
  
      return {} as AuthState;
    });
  
    const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
      const response = await api.post("/login", { email, password });
  
      const { accessToken, user } = response.data;
  
      localStorage.setItem("@Ber:accessToken", accessToken);
      localStorage.setItem("@Ber:user", JSON.stringify(user));
  
      setData({ accessToken, user });
    }, []);
  
    const signOut = useCallback(() => {
      localStorage.removeItem("@Ber:accessToken");
      localStorage.removeItem("@Ber:user");
  
      setData({} as AuthState);
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          accessToken: data.accessToken,
          user: data.user,
          signIn,
          signOut,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export { AuthProvider, useAuth }