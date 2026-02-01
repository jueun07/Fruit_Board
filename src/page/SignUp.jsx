import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import "./Auth.css";

function SignUp() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigater = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigater("/");
  };


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  // ✅ 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const openModal = (msg) => {
    setModalMessage(msg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !pw.trim() || !pw2.trim()) {
      openModal("모든 정보를 입력해주세요.");
      return;
    }

    if (pw !== pw2) {
      openModal("비밀번호가 서로 다릅니다.");
      return;
    }

    // ✅ 성공 모달
    openModal("회원가입 되었습니다!");
  };

  // ✅ 성공 모달에서 '확인' 누르면 홈으로 이동
  const handleModalConfirm = () => {
    closeModal();
    if (modalMessage === "회원가입 되었습니다!") {
      navigater("/");
    }
  };

  return (
    <>
      <header className="header">
        <div className="inner header-inner">
          <Link to="/" className="logo">
            <img src="/과일농과로고.png" alt="로고" />
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
                <div className="user-menu" ref={dropdownRef}>
                  <button
                    type="button"
                    className="user-trigger"
                    onClick={() => setOpen((v) => !v)}
                  >
                    <span>{user.name}</span>
                    <span>님</span>
                    <span>▼</span>
                  </button>

                  {open && (
                    <div className="dropdown">
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setOpen(false);
                          navigater("/mypage");
                        }}
                      >
                        마이페이지
                      </button>

                      <button
                        type="button"
                        className="dropdown-item danger"
                        onClick={handleLogout}
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/Login">로그인</Link>
                  <Link to="/SignUp" style={{color:"red"}}>회원가입</Link>
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
          <p className="login-desc">간단한 정보 입력으로 회원가입을 완료하세요.</p>

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
              onClick={() => navigater("/Login")}
            >
              로그인
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 모달 */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleModalConfirm}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
          >
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
