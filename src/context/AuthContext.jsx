import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const STORAGE_KEY = "fruit_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ 앱이 처음 켜질 때(새로고침 포함) localStorage에서 로그인 복원
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo)); // ✅ 저장
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY); // ✅ 삭제
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);