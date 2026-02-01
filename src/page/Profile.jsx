import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Profile.css";

function Profile() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigater = useNavigate();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") closeDropdown();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const closeDropdown = () => {
    if (!open) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 160); // CSS transition 시간과 맞추기
  };

  const toggleDropdown = () => {
    if (open) {
      closeDropdown();
    } else {
      setOpen(true);
    }
  };


  const handleLogout = () => {
    closeDropdown();
    logout();
    navigate("/");
  };


  return (
    <div className="page-wrap">
      <header className="header">
        <div className="inner header-inner">
          <Link to="/" className="logo">
            <img src="/과일농과로고.png" alt="로고" />
          </Link>

          <div className="header-right">
            <nav className="nav">
              <NavLink to="/Shopping">Shop</NavLink>
              <NavLink to="/post">게시판</NavLink>
              <NavLink to="/profile">인사말</NavLink>
              <NavLink to="/fruit">시세가</NavLink>
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
        {/* Hero */}
        <section className="hero">
          <div className="inner" />
        </section>

        {/* Content */}
        <section className="profile">
          <div className="inner">
            <h2>인사말</h2>

            <div className="tabs">
              {/* <span className="tab active">인사말</span> */}
              {/* <span className="divider" /> */}
              <Link to="/welcome" className="tab">
                오시는 길
              </Link>
            </div>

            <div className="content">
              <div className="text">
                <br></br>
                <p>
                  과일을 구매할 때마다 가격이 달라 혼란스러웠던 경험, 한 번쯤은 있으셨을 것이라 생각합니다.
                  같은 과일임에도 판매처에 따라 가격 차이가 크게 발생하고, 그 기준을 알기 어려운 것이 현실입니다.
                  <br></br>
                </p>
                과일농과는 이러한 불편함에서 출발했습니다.
                여러 온라인 과일 판매처의 가격 정보를 비교·분석하여,
                <br></br>
                소비자가 보다 합리적인 선택을 할 수 있도록 돕는 것이 저희의 역할입니다.
                <br></br>
                복잡한 가격 비교 과정을 줄이고,
                현재 시점에서 가장 낮은 가격의 과일 정보를 한눈에 확인할 수 있도록 정리합니다.
                이를 통해 소비자는 시간과 비용을 절약하고, 보다 투명한 기준으로 구매 결정을 내릴 수 있습니다.
                <br></br>
                과일농과는 단순히 가격을 나열하는 서비스를 넘어,
                신뢰할 수 있는 정보 제공과 지속적인 데이터 업데이트를 통해
                소비자와 판매자 모두에게 도움이 되는 플랫폼을 지향합니다.

                앞으로도 과일 시장의 가격 흐름을 보다 명확하게 전달하며,
                합리적인 소비 문화가 자리 잡을 수 있도록 노력하겠습니다.
              </div>

              <div className="image">
                <img src="/src/assets/과일농과.png" alt="인사말 이미지" />
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
  );
}

export default Profile;
