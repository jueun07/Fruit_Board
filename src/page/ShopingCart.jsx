import "./ShopingCart.css";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

function ShopingCart() {
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



  // ✅ Context에서 전부 가져오기
  const {
    cartItems,
    cartCount,
    increaseQty,
    decreaseQty,
    removeItem,
    totalPrice,
  } = useCart();

  return (
    <div className="page-wrap">
      <header className="header">
        <div className="inner header-inner">
          <Link to="/" className="logo">
            <img src="/과일농과로고.png" alt="로고" />
          </Link>

          <div className="header-right">
            <nav className="nav">
              <Link to="/Shopping" className="shop-link">
                Shop
              </Link>
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

      {/* ✅ main 하나만 사용 */}
      <main className="page-content">
        <div className="cart-container">
          <h2>🛒 장바구니</h2>

          {cartItems.length === 0 ? (
            <p className="empty">장바구니가 비어 있습니다.</p>
          ) : (
            <>
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.img} alt={item.name} />

                    <div className="cart-info">
                      <h4>{item.name}</h4>
                      <p>{item.price.toLocaleString()}원</p>

                      <div className="quantity">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)}>+</button>
                      </div>
                    </div>

                    <div className="cart-price">
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>

                    <button
                      className="remove"
                      onClick={() => removeItem(item.id)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3>총 결제 금액</h3>
                <p className="color">{totalPrice.toLocaleString()}원</p>

                <button
                  className="order-btn"
                  onClick={() =>
                    navigater("/checkout", {
                      state: { cartItems, totalPrice },
                    })
                  }
                >
                  주문하기
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ✅ footer는 항상 하단 */}
      <footer className="footer">
        <div className="inner">
          <p>© 과일농과. All Rights Reserved. 010-1234-5678</p>
        </div>
      </footer>
    </div>
  );
}

export default ShopingCart;
