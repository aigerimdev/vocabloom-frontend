import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { is_authenticated, login, register } from "../endpoints/api";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login_user: (username: string, password: string) => Promise<void>;
  register_user: (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<any | void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const nav = useNavigate();

  const get_authenticated = async () => {
    try {
      const success = await is_authenticated();
      setIsAuthenticated(success);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // NO nav argument! Use the nav in scope.
  const login_user = async (
    username: string,
    password: string
  ): Promise<void> => {
    const success = await login(username, password);
    if (success) {
      setIsAuthenticated(true);
      nav("/");
    }
  };

  const register_user = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<any | void> => {
    if (password === confirmPassword) {
      try {
        await register(username, email, password, firstName, lastName);
        alert('successfully registered user')
      } catch (error) {
        console.log(error)
        alert('error registering user')
      }
    } else {
      alert("Passwords don't match");
    }
  };

  // useEffect(() => {
  //   get_authenticated();
  //   // eslint-disable-next-line
  // }, [window.location.pathname]);
  useEffect(() => {
    get_authenticated();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated, login_user, register_user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
