import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Welcome.css";
import logo from '/과일농과로고.png'
import 지도 from "../assets/지도.png";
import { useDropdown } from "../hooks/useDropdown";

function Welcome() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
  open,
  closing,
  dropdownRef,
  toggleDropdown,
  closeDropdown,
} = useDropdown();

  const handleLogout = () => {
    closeDropdown();
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="page-wrap">
        <header className="header">
          <div className="inner header-inner">
            <Link to="/" className="logo">
              <img src={logo} alt="로고" />
            </Link>

            <div className="header-right">
              <nav className="nav">
                <Link to="/Shopping">Shop</Link>
                <Link to="/post">게시판</Link>
                <Link to="/Profile" className="active">
                  인사말
                </Link>
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

        <main className="page-content">
          <section className="hero">
            <div className="inner" />
          </section>

          <section className="profile">
            <div className="inner">
              <h2>오시는 길</h2>

              <div className="tabs">
                <Link to="/Profile" className="tab active">
                  인사말
                </Link>
              </div>

              <div className="content">
                <div className="text"></div>

                <div className="image2">
                  <img src={지도} alt="오시는 길 지도" />
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="inner">
            <p>© 과일농과. All Rights Reserved. 010-1234-5678</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Welcome;