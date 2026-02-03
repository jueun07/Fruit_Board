import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PostDetail from "./PostDetail";
import { supabase } from "../supabase";
import "./Post.css";
import logo from "/과일농과로고.png";
import { useDropdown } from "../hooks/useDropdown";

function Post() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("게시글 조회 실패", error);
        return;
      }
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const sortedPosts = [...posts].sort((a, b) => {
    // 1️⃣ 고정글 우선
    if ((b.is_pinned ?? 0) !== (a.is_pinned ?? 0)) {
      return (b.is_pinned ?? 0) - (a.is_pinned ?? 0);
    }

    // 2️⃣ 최신 글 우선
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      author: user.user_metadata?.name || "사용자",
    });

    if (error) {
      alert("저장 실패");
      console.error(error);
      return;
    }

    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts(data);
    setTitle("");
    setContent("");
    setShowForm(false);
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
              <NavLink to="/Shopping">Shop</NavLink>
              <NavLink to="/post">게시판</NavLink>
              <NavLink to="/Profile">인사말</NavLink>
              <NavLink to="/fruit">시세가</NavLink>
            </nav>

            <div className="auth">
              {user ? (
                <div className="user-menu" ref={dropdownRef}>
                  <button className="user-trigger" onClick={toggleDropdown}>
                    <span>{user.name}</span>
                    <span>님</span>
                    <span>▼</span>
                  </button>

                  {(open || closing) && (
                    <div className={`dropdown ${closing ? "closing" : ""}`}>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          closeDropdown();
                          navigate("/mypage");
                        }}
                      >
                        마이페이지
                      </button>
                      <button
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

      {/* ================= Main ================= */}
      <main className="post-page">
        <div className="post-header">
          <h1>게시판</h1>
          <button
            className="write-btn"
            onClick={() => {
              if (!user) {
                alert("로그인이 필요합니다.");
                return;
              }
              setShowForm(true);
            }}
          >
            글 작성
          </button>
        </div>

        {showForm && (
          <div className="post-form">
            <input
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

        <section className="post-list">
          {sortedPosts.map((post) => (
            <article
              key={post.id}
              className={`post-card ${
                selectedPost?.id === post.id ? "active" : ""
              }`}
              onClick={() =>
                setSelectedPost(selectedPost?.id === post.id ? null : post)
              }
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-footer">
                {post.author && <span className="author">{post.author}</span>}
                <span className="date">
                  {new Date(post.created_at).toLocaleString()}
                </span>
              </div>
            </article>
          ))}
        </section>

        {selectedPost && (
          <PostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onDelete={handleDelete}
            onUpdate={async () => {
              const { data } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false });

              setPosts(data);
            }}
          />
        )}
      </main>

      <footer className="footer">
        <div className="inner">
          <p>© 과일농과. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Post;
