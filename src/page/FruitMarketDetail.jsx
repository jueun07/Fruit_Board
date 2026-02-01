import { Link, useParams, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import FruitChartPage from "./FruitChartPage";
import { useAuth } from "../context/AuthContext";
import "./FruitMarketDetail.css";
import { fruits } from "../data/fruitData";

function FruitMarketDetail() {
  const { id } = useParams();
  const { cartCount, addToCart } = useCart();

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



  /* ✅ 검색 + 더보기 상태 */
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const fruitId = id ? Number(id) : 1;
  const fruit = fruits.find((f) => f.id === fruitId);

  if (!fruit) {
    return <div style={{ padding: 40 }}>존재하지 않는 과일입니다.</div>;
  }

  /* ✅ 검색 우선, 아니면 더보기 */
  const filteredFruits = fruits.filter((f) => {
    const keyword = search.trim();
    const searchTarget = `${f.name} ${f.unit || ""}`;
    return searchTarget.includes(keyword);
  });

  const visibleFruits =
    search.length > 0 ? filteredFruits : showAll ? fruits : [];

  return (
    <div className="page">
      {/* HEADER */}
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
              <Link style={{ color: "red" }} to="/fruit/1">
                시세가
              </Link>
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
                          navigatee("/mypage");
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

      {/* MAIN */}
      <main className="content">
        <div className="market-wrap">
          <h2>🔍 과일 검색</h2>

          {/* 🔍 검색 */}
          <div className="fruit-search">
            <input
              type="text"
              placeholder="과일 이름 또는 단위(개, 팩, 묶음)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ▾ 과일 목록 펼치기 / 접기 */}
          {search.length === 0 && (
            <button
              className="toggle-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "▲ 과일 목록 접기" : "▼ 과일 목록 펼치기"}
            </button>
          )}

          {/* 🍉 과일 버튼 목록 */}
          {visibleFruits.length > 0 && (
            <div className="fruit-tabs">
              {visibleFruits.map((f) => (
                <Link
                  key={f.id}
                  to={`/fruit/${f.id}`}
                  className={`fruit-tab ${f.id === fruit.id ? "active" : ""}`}
                >
                  {f.name}
                </Link>
              ))}
            </div>
          )}

          {/* 상품 정보 */}
          <div className="product-area">
            <img src={fruit.image} alt={fruit.name} />

            <div className="price-info">
              {/* ✅ 과일 이름을 최저가 위로 이동 */}
              <div className="product-title">{fruit.name}</div>

              <div className="price-top">
                <span>최저가</span>
                <strong className="price-value">
                  {fruit.lowestPrice.toLocaleString()}원
                </strong>

                <div className="button-group">
                  <button
                    className="cart-btn"
                    onClick={() => {
                      addToCart({
                        id: fruit.id,
                        name: fruit.name,
                        price: fruit.lowestPrice,
                        img: fruit.image,
                      });
                      alert("장바구니에 담겼습니다");
                      navigate("/ShopinCart");
                    }}
                  >
                    장바구니 담기
                  </button>

                  <button
                    className="pay-btn"
                    onClick={() => navigate("/Shoping")}
                  >
                    Shop으로 돌아가기
                  </button>
                </div>
              </div>

              <div className="seller-box">
                <h4>판매처별 가격 비교</h4>

                <div className="seller-header">
                  <span>판매처</span>
                  <span>가격</span>
                  <span>배송</span>
                  <span>재고</span>
                </div>

                {fruit.sellers.map((seller, idx) => (
                  <div className="seller-row" key={idx}>
                    <span>{seller.name}</span>
                    <span>{seller.price.toLocaleString()}원</span>
                    <span>{seller.delivery}</span>
                    <span>{seller.stock}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 시세 차트 */}
          <div className="chart-area">
            {/* ✅ 과일 시세를 그래프 설명 위에 */}
            <h4 className="chart-title">과일 시세</h4>
            <FruitChartPage data={fruit.priceHistory} />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="inner">
          <p>© 과일농과. All Rights Reserved. 010-1234-5678</p>
        </div>
      </footer>
    </div>
  );
}

export default FruitMarketDetail;