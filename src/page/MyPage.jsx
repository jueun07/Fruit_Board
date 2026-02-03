import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "/과일농과로고.png";
import { useDropdown } from "../hooks/useDropdown";
import { useState, useEffect } from "react";

function MyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [orders, setOrders] = useState([]);

  const { open, closing, dropdownRef, toggleDropdown, closeDropdown } =
    useDropdown();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders") || "[]");
    const filtered = user?.name
      ? saved.filter((o) => o.userName === user.name)
      : saved;
    setOrders(filtered);
  }, [user]);

  const handleLogout = async () => {
    closeDropdown();

    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
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

      <main className="page-content">
        <div className="inner" style={{ padding: "40px 20px" }}>
          <h2 style={{ marginBottom: "20px" }}>마이페이지</h2>

          <h3 style={{ marginBottom: "12px" }}>주문내역</h3>

          {orders.length === 0 ? (
            <p>주문내역이 없습니다.</p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {orders.map((o) => (
                <div
                  key={o.orderId}
                  style={{
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>주문번호 : {o.orderId}</strong>
                    <span>{new Date(o.createdAt).toLocaleString()}</span>
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    {o.items.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          {it.name} x {it.quantity}
                        </span>
                        <span>
                          {(it.price * it.quantity).toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "10px", fontWeight: 600 }}>
                    합계 : {Number(o.totalPrice).toLocaleString()}원
                  </div>

                  <div
                    style={{
                      marginTop: "6px",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    배송지 : {o.shipping?.address}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="inner">
          <p>© 과일농과. All Rights Reserved. 010-1234-5678</p>
        </div>
      </footer>
    </div>
  );
}

export default MyPage;
