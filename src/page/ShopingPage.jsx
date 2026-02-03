import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./shopingPage.css";
import logo from '/과일농과로고.png'
import { fruitImages } from "../assets/fruitImages";
import { useDropdown } from "../hooks/useDropdown";

function Shoping() {
  const { addToCart, cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

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

  const PRICE_RANGES = [
    { label: "1,000원 이하", min: 0, max: 1000 },
    { label: "1,000원 ~ 5,000원", min: 1000, max: 5000 },
    { label: "5,000원 ~ 10,000원", min: 5000, max: 10000 },
    { label: "10,000원 이상", min: 10000, max: Infinity },
  ];

  const [products] = useState([
    { id: 1, name: "수박 한 개", price: 3200, imageKey: "수박", rating: 5, category: "개" },
    { id: 2, name: "바나나 한 팩", price: 5000, imageKey: "바나나", rating: 5, category: "팩" },
    { id: 3, name: "귤 한 개", price: 315000, imageKey: "귤", rating: 5, category: "개" },
    { id: 4, name: "레몬 한 개", price: 1000, imageKey: "레몬", rating: 5, category: "개" },
    { id: 5, name: "메론 한 개", price: 12500, imageKey: "메론", rating: 5, category: "개" },
    { id: 6, name: "애플망고 한 개", price: 100000, imageKey: "애플망고", rating: 5, category: "개" },
    { id: 7, name: "파인애플 한 팩", price: 3000, imageKey: "파인애플", rating: 5, category: "팩" },
    { id: 8, name: "딸기 한 팩", price: 300, imageKey: "딸기", rating: 5, category: "팩" },
    { id: 9, name: "샤인머스켓 한 묶음", price: 8000, imageKey: "샤인머스켓", rating: 5, category: "묶음" },
    { id: 10, name: "복숭아 한 개", price: 2000, imageKey: "복숭아", rating: 5, category: "개" },
    { id: 11, name: "풋사과 한 개", price: 800, imageKey: "풋사과", rating: 5, category: "개" },
    { id: 12, name: "아로니아 한 팩", price: 3500, imageKey: "아로니아", rating: 5, category: "팩" },
    { id: 13, name: "감자 한 팩", price: 1900, imageKey: "감자", rating: 5, category: "팩" },
    { id: 14, name: "고구마 한 묶음", price: 5700, imageKey: "고구마", rating: 5, category: "묶음" },
    { id: 15, name: "파 한 개", price: 600, imageKey: "파", rating: 5, category: "개" },
    { id: 16, name: "연근 한 묶음", price: 2600, imageKey: "연근", rating: 5, category: "묶음" },
    { id: 17, name: "토마토 한 개", price: 400, imageKey: "토마토", rating: 5, category: "개" },
    { id: 18, name: "당근 한 팩", price: 3400, imageKey: "당근", rating: 5, category: "팩" },
    { id: 19, name: "오이 한 묶음", price: 4200, imageKey: "오이", rating: 5, category: "묶음" },
  ]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const togglePrice = (label) => {
    setSelectedPrices((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const priceMatch =
      selectedPrices.length === 0 ||
      PRICE_RANGES.some(
        (range) =>
          selectedPrices.includes(range.label) &&
          product.price >= range.min &&
          product.price < range.max
      );

    return categoryMatch && priceMatch;
  });

  return (
    <div className="page-wrap">
      <header className="header">
        <div className="inner header-inner">
          <Link to="/" className="logo">
            <img src={logo} alt="로고" />
          </Link>

          <div className="header-right">
            <nav className="nav">
              <Link to="/Shopping" className="active">Shop</Link>
              <Link to="/post">게시판</Link>
              <Link to="/Profile">인사말</Link>
              <Link to="/fruit">시세가</Link>
            </nav>

            <div className="auth">
              {user ? (
                <div className="user-menu" ref={dropdownRef}>
                  <button type="button" className="user-trigger" onClick={toggleDropdown}>
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

      <main className="page-contant">
        <div className="shop-container">
          <aside className="sidebar">
            <h3 className="color">필터 검색</h3>

            <div className="filter-group category">
              <h4 className="color">카테고리</h4>
              <ul>
                {["팩", "묶음", "개"].map((cat) => (
                  <li key={cat}>
                    <label className="category-option">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group price">
              <h4 className="color">가격대</h4>
              <ul>
                {PRICE_RANGES.map((range) => (
                  <li key={range.label}>
                    <label className="filter-option price-option">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(range.label)}
                        onChange={() => togglePrice(range.label)}
                      />
                      <span>{range.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="reset-filter"
              onClick={() => {
                setSelectedCategories([]);
                setSelectedPrices([]);
              }}
            >
              필터 초기화
            </button>
          </aside>

          <main className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={fruitImages[product.imageKey]}
                  alt={product.name}
                />

                <div className="product-info">
                  <h4 className="color">{product.name}</h4>
                  <p className="price">
                    {product.price.toLocaleString()}원
                  </p>
                  <button
                    className="add-cart"
                    onClick={() => {
                      addToCart({
                        ...product,
                        img: fruitImages[product.imageKey],
                      });
                      alert("장바구니에 담겼습니다");
                    }}
                  >
                    장바구니 담기
                  </button>
                  <button
                    className="view-price"
                    onClick={() => navigate(`/fruit/${product.id}`)}
                  >
                    시세가
                  </button>
                </div>
              </div>
            ))}
          </main>
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

export default Shoping;