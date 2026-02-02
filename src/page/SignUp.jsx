import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./Auth.css";
import logo from "/과일농과로고.png";

function SignUp() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, signup, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

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

    if (!email.trim() || !pw.trim() || !pw2.trim()) {
      openModal("모든 정보를 입력해주세요.");
      return;
    }

    if (pw !== pw2) {
      openModal("비밀번호가 서로 다릅니다.");
      return;
    }

    try {
      await signup(email, pw);
      openModal("회원가입이 완료되었습니다. 로그인해주세요.", true);
    } catch (e) {
      openModal(e.message || "회원가입 실패");
    }
  };

  const handleModalConfirm = () => {
    closeModal();
    if (isSuccess) navigate("/Login");
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
                  <Link to="/Login">로그인</Link>
                  <Link to="/SignUp" style={{ color: "red" }}>
                    회원가입
                  </Link>
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
          <h1 className="login-title">회원가입</h1>
          <p className="login-desc">
            이메일과 비밀번호로 회원가입을 진행합니다.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
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

            <label>
              비밀번호 확인
              <input
                type="password"
                placeholder="비밀번호 다시 입력"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="login-button">
              회원가입
            </button>
          </form>

          <div className="login-footer">
            <span style={{ color: "#000", padding: "20px" }}>
              이미 계정이 있으신가요?
            </span>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/Login")}
            >
              로그인
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

export default SignUp;