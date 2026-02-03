import { useNavigate, NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Auth.css";
import logo from "/과일농과로고.png";
import { supabase } from "../supabase";

function Login() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const openModal = (msg, success = false) => {
    setModalMessage(msg);
    setIsSuccess(success);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !pw.trim()) {
      openModal("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!name.trim()) {
      openModal("이름을 입력해주세요.");
      return;
    }

    // 1️⃣ 로그인 (이메일/비번)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    });

    if (error) {
      openModal("로그인 실패: " + error.message);
      return;
    }

    // 2️⃣ 로그인 성공 후 이름 저장 (user_metadata)
    await supabase.auth.updateUser({
      data: {
        name: name,
      },
    });

    // 3️⃣ Context에 사용자 저장
    login({
      id: data.user.id,
      email: data.user.email,
      name: name,
    });

    // 4️⃣ 성공 안내
    openModal("로그인 되었습니다!", true);
  };

  const handleModalConfirm = () => {
    closeModal();
    if (isSuccess) navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="inner header-inner">
          <Link to="/" className="logo">
            <img src={logo} alt="로고" />
          </Link>

          <div className="header-right">
            <nav className="nav">
              <Link to="/Shopping">Shop</Link>
              <Link to="/post">게시판</Link>
              <Link to="/Profile">인사말</Link>
              <Link to="/fruit">시세가</Link>
            </nav>

            <div className="auth">
              {user ? (
                <>
                  <span className="nav-item user-name">{user.email}</span>
                  <button
                    type="button"
                    className="nav-item logout-btn"
                    onClick={logout}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link to="/Login" style={{ color: "red" }}>
                    로그인
                  </Link>
                  <Link to="/SignUp">회원가입</Link>
                </>
              )}

              <NavLink
                to="/ShopinCart"
                className={({ isActive }) =>
                  isActive ? "cart-link active" : "cart-link"
                }
              >
                장바구니
                {cartCount > 0 && (
                  <span className="cart-count">({cartCount})</span>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <div className="login-page">
        <div className="login-box">
          <h1 className="login-title">로그인</h1>
          <p className="login-desc">
            과일농과 서비스를 이용하려면 로그인하세요.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              이름
              <input
                type="text"
                placeholder="이름 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              이메일
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              비밀번호
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="login-button">
              로그인
            </button>
          </form>

          <div className="login-footer">
            <span style={{ color: "#000", padding: "20px" }}>
              계정이 없으신가요?
            </span>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/SignUp")}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleModalConfirm}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">알림</h3>
            <p className="modal-message">{modalMessage}</p>
            <div className="modal-actions">
              <button className="modal-btn" onClick={handleModalConfirm}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
