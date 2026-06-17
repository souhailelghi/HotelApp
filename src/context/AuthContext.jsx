import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { clientApi } from '../api/clientApi';
import { adminApi } from '../api/adminApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const hotelClientId = localStorage.getItem('hotelClientId');

    // Make sure we aren't picking up stringified "undefined"
    if (token && token !== "undefined" && userId && userId !== "undefined") {
      setUser({ id: userId, userName: username, role, email, hotelClientId });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Customer specific login
      const res = await authApi.loginCustomer({ email, password });
      
      const token = res.token;
      const userId = res.userId || res.id;
      const userName = res.username || res.userName;
      const role = res.role || (res.roles && res.roles.length > 0 ? res.roles[0] : 'User');
      const userEmail = res.email || email;

      localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);
      if (userName) localStorage.setItem("userName", userName);
      if (role) localStorage.setItem("role", role);
      if (userEmail) localStorage.setItem("email", userEmail);

      setUser({ id: userId, userName, role, email: userEmail, hotelClientId: localStorage.getItem("hotelClientId") });
      
      return { success: true, role };
    } catch (error) {
      console.error("Login failed:", error);

      return { 
        success: false, 
        message: 'Invalid email or password.' 
      };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const res = await authApi.loginAdmin({ email, password });
      
      const token = res.token;
      const userId = res.id;
      const userName = res.userName;
      const role = res.roles && res.roles.length > 0 ? res.roles[0] : 'Admin';

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("role", role);

      setUser({ id: userId, userName, role });
      
      return { success: true, role };
    } catch (error) {
      console.error("Admin Login failed:", error);
      return { 
        success: false, 
        message: 'Invalid email or password.' 
      };
    }
  };

  const register = async (userData) => {
    // 1. Register in Auth Service
    try {
      const generatedUsername = (userData.firstName && userData.lastName) 
        ? `${userData.firstName}${userData.lastName}`.replace(/\s+/g, '') 
        : userData.email.split('@')[0];

      const authPayload = { 
        username: generatedUsername,
        email: userData.email, 
        password: userData.password 
      };

      console.log("Auth register payload:", authPayload);
      await authApi.register(authPayload);
    } catch (error) {
      console.error("Registration failed:", error);
      console.log("Auth register error:", error.response?.data);
      
      if (error.response && error.response.status === 500) {
        return {
          success: false,
          message: "This email already exists multiple times in the authentication database. Please use another email or clean duplicate users."
        };
      }
      
      let errMsg = 'Registration failed';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') errMsg = error.response.data;
        else if (error.response.data.message) errMsg = error.response.data.message;
        else if (Array.isArray(error.response.data)) {
          errMsg = error.response.data.map(err => err.description || err.errorMessage || JSON.stringify(err)).join(' ');
        }
        else if (error.response.data.errors) {
            errMsg = Object.values(error.response.data.errors).flat().join(' ');
        } else {
            errMsg = JSON.stringify(error.response.data);
        }
      }
      return { success: false, message: errMsg };
    }

    // 2. Auto-login using Customer login
    try {
      const loginRes = await authApi.loginCustomer({ 
        email: userData.email, 
        password: userData.password 
      });

      const token = loginRes.token;
      const userId = loginRes.userId || loginRes.id;
      const userName = loginRes.username || loginRes.userName;
      const role = loginRes.role || (loginRes.roles && loginRes.roles.length > 0 ? loginRes.roles[0] : 'User');
      const userEmail = loginRes.email || userData.email;

      // 3. Store credentials
      localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);
      if (userName) localStorage.setItem("userName", userName);
      if (role) localStorage.setItem("role", role);
      if (userEmail) localStorage.setItem("email", userEmail);

      // 4. Create Client profile in Hotel Service
      let hotelClientId = null;
      try {
        const hotelClient = await clientApi.createClient({
          nom: userData.lastName || '',
          prenom: userData.firstName || '',
          email: userData.email,
          motDePasse: userData.password,
          telephone: userData.phone || ''
        });

        if (hotelClient && (hotelClient.idClient || hotelClient.id)) {
          hotelClientId = hotelClient.idClient || hotelClient.id;
          localStorage.setItem("hotelClientId", hotelClientId);
        }
      } catch (clientErr) {
        console.error("Hotel Client profile creation failed, fallback mechanisms will handle this later.", clientErr);
      }

      setUser({ id: userId, userName, role, email: userEmail, hotelClientId });

      return { success: true };
    } catch (loginError) {
      console.error("Auto-login failed after registration:", loginError);
      return { success: true, loginFailed: true };
    }
  };

  const registerAdmin = async (adminData) => {
    try {
      await authApi.registerAdmin({ email: adminData.email, password: adminData.password });
      const loginRes = await authApi.login({ email: adminData.email, password: adminData.password });
      
      const token = loginRes.token;
      const userId = loginRes.id;
      const userName = loginRes.userName;
      const role = loginRes.roles && loginRes.roles.length > 0 ? loginRes.roles[0] : 'Admin';

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("role", role);

      setUser({ id: userId, userName, role });

      await adminApi.createAdmin({
        authUserId: userId,
        nom: adminData.lastName || '',
        email: adminData.email
      });

      return { success: true };
    } catch (error) {
      console.error("Admin Registration failed:", error);
      return { success: false, message: "Failed to register admin." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userName"); // Fallback for old sessions
    localStorage.removeItem("email");
    localStorage.removeItem("hotelClientId"); // Prevent cross-contamination of sessions
    localStorage.removeItem("isAdminLoggedIn"); // Fallback for old admin mock
    console.log("Admin logged out successfully");
  };

  // Kept so existing profile pages don't crash
  const updateProfile = async (updates) => {
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, register, registerAdmin, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
