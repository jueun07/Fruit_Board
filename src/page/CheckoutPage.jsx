import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, NavLink } from "react-router-dom";
import "./CheckoutPage.css";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
  const { cartItems, totalPrice, cartCount, clearCart } = useCart();

  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handlePayment = () => {
    if (!shipping.name || !shipping.phone || !shipping.address) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }

     const order = {
    orderId: Date.now(), // 간단한 주문번호
    userName: user?.name || shipping.name,
    items: cartItems.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    totalPrice,
    shipping: { ...shipping },
    paymentMethod,
    createdAt: new Date().toISOString(),
  };

  const prev = JSON.parse(localStorage.getItem("orders") || "[]");
  localStorage.setItem("orders", JSON.stringify([order, ...prev]));


    alert("결제가 완료되었습니다!");
    clearCart();      // ✅ 장바구니 초기화
    navigate("/mypage");    // ✅ 홈으로 이동
  };

  return (
    <div className="page-wrap">
      <header className="header">
        <div className="inner header-inner">
          <Link to="/" className="logo">
            <img src="/src/assets/과일농과로고.png" alt="로고" />
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
        <div className="checkout">
          <h2>결제하기</h2>

          <section className="section">
            <h3>주문 상품</h3>

            {cartItems.length === 0 ? (
              <p>주문 상품이 없습니다.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>
                </div>
              ))
            )}
          </section>

          <section className="section">
            <h3>배송 정보</h3>
            <input
              placeholder="이름"
              value={shipping.name}
              onChange={(e) =>
                setShipping({ ...shipping, name: e.target.value })
              }
            />
            <input
              placeholder="전화번호"
              value={shipping.phone}
              onChange={(e) =>
                setShipping({ ...shipping, phone: e.target.value })
              }
            />
            <input
              className="juso"
              placeholder="주소"
              value={shipping.address}
              onChange={(e) =>
                setShipping({ ...shipping, address: e.target.value })
              }
            />
          </section>

          <section className="section">
            <h3>결제 수단</h3>

            <div className="payment-option">
              <span>카드 결제</span>
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
            </div>

            <div className="payment-option">
              <span>무통장 입금</span>
              <input
                type="radio"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
              />
            </div>
          </section>

          <section className="section summary">
            <h3>결제 금액</h3>
            <p>총 금액: {totalPrice.toLocaleString()}원</p>
            <button onClick={handlePayment}>결제하기</button>
          </section>
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

export default CheckoutPage;