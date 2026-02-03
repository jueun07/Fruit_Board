import { useNavigate, NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./HomePage.css";
import { useAuth } from "../context/AuthContext";
import logo from "/과일농과로고.png";
import { useDropdown } from "../hooks/useDropdown";

function HomePage() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { open, closing, dropdownRef, toggleDropdown, closeDropdown } =
    useDropdown();

  const handleLogout = () => {
    closeDropdown();
    logout();
    navigate("/");
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
                <div className="user-menu" ref={dropdownRef}>
                  <button
                    type="button"
                    className="user-trigger"
                    onClick={toggleDropdown}
                  >
                    <span>{user.name}</span>
                    <span>님</span>
                    <span>▼</span>
                  </button>

                  {(open || closing) && (
                    <div className={`dropdown ${closing ? "closing" : ""}`}>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          closeDropdown();
                          navigate("/mypage");
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

      <main className="main-content">
        <div className="hero-text">
          <h1 className="main-title">과일농과</h1>
          <h2 className="sub-title">최저가 과일 구매 사이트</h2>
          <br />
          <button onClick={() => navigate("/Shopping")} className="cta-button">
            쇼핑하기
          </button>
        </div>
      </main>
    </>
  );
}

export default HomePage;
