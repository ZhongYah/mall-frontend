import { createContext, useState } from 'react';

// 建立 context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser || null);

  const login = (username) => {
    const userObj = { name: username };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
