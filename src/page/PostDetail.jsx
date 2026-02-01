import { useEffect, useState } from "react";

function PostDetail({ post, onClose, onDelete, onUpdate }) {
  const API_BASE = import.meta.env.DEV ? "http://localhost:3001" : "";

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  // 댓글 불러오기
  useEffect(() => {
    if (!import.meta.env.DEV) {
      setComments([]);
      return;
    }

    fetch(`${API_BASE}/posts/${post.id}/comments`)
      .then((res) => res.json())
      .then(setComments)
      .catch(console.error);
  }, [post.id]);

  // 댓글 작성
  const submitComment = () => {
    if (!import.meta.env.DEV) {
      alert("배포(GitHub Pages)에서는 댓글 기능이 동작하지 않습니다. 로컬에서만 가능합니다.");
      return;
    }

    if (!comment.trim()) return;

    fetch(`${API_BASE}/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: comment,
        author: "사용자",
      }),
    })
      .then(() => {
        setComment("");
        return fetch(`${API_BASE}/posts/${post.id}/comments`);
      })
      .then((res) => res.json())
      .then(setComments)
      .catch(console.error);
  };

  // 댓글 삭제
  const deleteComment = (id) => {
    if (!import.meta.env.DEV) {
      alert("배포(GitHub Pages)에서는 삭제 기능이 동작하지 않습니다. 로컬에서만 가능합니다.");
      return;
    }

    fetch(`${API_BASE}/comments/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setComments(comments.filter((c) => c.id !== id));
      })
      .catch(console.error);
  };

  // 게시글 수정 저장
  const saveEdit = () => {
    if (!import.meta.env.DEV) {
      alert("배포(GitHub Pages)에서는 수정 기능이 동작하지 않습니다. 로컬에서만 가능합니다.");
      return;
    }

    fetch(`${API_BASE}/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    })
      .then(() => {
        setIsEdit(false);
        onUpdate();
      })
      .catch(console.error);
  };

  const deletePost = () => {
    if (!import.meta.env.DEV) {
      alert("배포(GitHub Pages)에서는 삭제 기능이 동작하지 않습니다. 로컬에서만 가능합니다.");
      return;
    }

    if (!window.confirm("게시글을 삭제할까요?")) return;

    fetch(`${API_BASE}/posts/${post.id}`, { method: "DELETE" })
      .then(() => {
        onDelete(post.id);
        onClose();
      })
      .catch(console.error);
  };

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={onClose}>
        ← 목록
      </button>

      {isEdit ? (
        <>
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
          <div className="detail-actions">
            <button onClick={saveEdit}>저장</button>
            <button onClick={() => setIsEdit(false)}>취소</button>
          </div>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>

          <div className="detail-actions">
            <button onClick={() => setIsEdit(true)}>수정</button>
            <button className="danger" onClick={deletePost}>
              삭제
            </button>
          </div>
        </>
      )}

      <hr />
      <br />
      <h4>댓글</h4>

      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id}>
            {c.content}
            <span> · {c.author}</span>
            <button onClick={() => deleteComment(c.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <div className="comment-form">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button className="submit-btn" onClick={submitComment}>
          등록
        </button>
      </div>
    </div>
  );
}

export default PostDetail;