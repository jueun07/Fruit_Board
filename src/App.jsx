import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider } from "./context/CartContext"; // ✅ 추가

import Profile from "./page/Profile.jsx";
import HomePage from "./page/HomePage.jsx";
import Welcome from "./page/Welcome.jsx";
import Shoping from "./page/ShopingPage.jsx";
import Login from "./page/Login.jsx";
import SignUp from "./page/SignUp.jsx";
import ShopingCart from "./page/ShopingCart.jsx";
import CheckoutPage from "./page/CheckoutPage.jsx";
import Post from "./page/Post.jsx";
import FruitMarketDetail from "./page/FruitMarketDetail.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import MyPage from "./page/MyPage.jsx";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/test")
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return (
  <AuthProvider>
    <CartProvider> {/* ✅ 이게 핵심 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/Shopping" element={<Shoping />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/shopincart" element={<ShopingCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/post" element={<Post />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* 과일 상세 */}
        <Route path="/fruit/:id" element={<FruitMarketDetail />} />

        {/* /fruit → 기본값 */}
        <Route path="/fruit" element={<Navigate to="/fruit/1" replace />} />
      </Routes>
    </CartProvider>
  </AuthProvider>
  );
}

export default App;