import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PostDetail from "./PostDetail";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Post.css";
import { API_BASE } from "../apiBase";

function Post() {
 const API_BASE = import.meta.env.VITE_API_BASE;
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { cartCount } = useCart();
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

  const sortedPosts = [...posts].sort((a, b) => {
    return (b.is_pinned ?? 0) - (a.is_pinned ?? 0);
  });

  // ✅ 게시글 목록 불러오기 (포트 수정)
  useEffect(() => {
    if (!import.meta.env.DEV) {
      setPosts([]);
      return;
    }

    fetch(`${API_BASE}/posts`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);
  }, []);


  const handleSubmit = async () => {
    if (!import.meta.env.DEV) {
      alert("배포(GitHub Pages)에서는 게시판 기능이 동작하지 않습니다. 로컬에서만 가능합니다.");
      return;
    }

    if (!title.trim() || !content.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          author: "사용자",
        }),
      });

      // ✅ 여기서 성공/실패를 눈으로 확인
      if (!res.ok) {
        const msg = await res.text();
        alert("저장 실패: " + msg);
        return;
      }

      alert("게시글이 등록 되었습니다!");

      const listRes = await fetch(`${API_BASE}/posts`);
      const data = await listRes.json();
      setPosts(data);

      setTitle("");
      setContent("");
      setShowForm(false);
    } catch (e) {
      alert("서버 연결 실패(서버가 꺼졌을 수 있음)");
      console.error(e);
    }
  };


  return (
    <div className="page-wrap">
      {/* ===== HEADER ===== */}
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

      {/* ===== MAIN ===== */}
      <main className="post-page">
        <div className="post-header">
          <h1>게시판</h1>
          <button className="write-btn" onClick={() => setShowForm(true)}>
            글 작성
          </button>
        </div>

        {/* 글 작성 폼 */}
        {showForm && (
          <div className="post-form">
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="form-actions">
              <button onClick={handleSubmit}>등록</button>
              <button onClick={() => setShowForm(false)}>취소</button>
            </div>
          </div>
        )}

        {/* 게시글 목록 */}
        <section className="post-list">
          {sortedPosts.map((post) => (
            <article
              key={post.id}
              className={`post-card 
    ${post.is_pinned === 1 ? "pinned" : ""} 
    ${selectedPost?.id === post.id ? "active" : ""}`}
              onClick={() => {
                if (selectedPost?.id === post.id) {
                  setSelectedPost(null);
                } else {
                  setSelectedPost(post);
                }
              }}
            >
              <h3>
                {post.is_pinned === 1 && "📌 "}
                {post.title}
              </h3>

              <p>
                {post.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>

              <div className="post-footer">
                <span className="author">{post.author}</span>
                <span className="date">{post.date}</span>
              </div>
            </article>
          ))}
        </section>

        {/* 상세 보기 */}
        {selectedPost && (
          <PostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onDelete={(id) => {
              setPosts(posts.filter((p) => p.id !== id));
            }}
            onUpdate={() => {
              if (!import.meta.env.DEV) return;

              fetch(`${API_BASE}/posts`)
                .then((res) => res.json())
                .then(setPosts)
                .catch(console.error);
            }}
          />
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="inner">
          <p>© 과일농과. All Rights Reserved. 010-1234-5678</p>
        </div>
      </footer>
    </div>
  );
}

export default Post;
