import { useEffect, useState } from "react";

function PostDetail({ post, onClose, onDelete, onUpdate }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  // ✨ 수정 상태
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  // 댓글 불러오기
  useEffect(() => {
    fetch(`http://localhost:3001/posts/${post.id}/comments`)
      .then((res) => res.json())
      .then(setComments);
  }, [post.id]);

  // 댓글 작성
  const submitComment = () => {
    if (!comment.trim()) return;

    fetch(`http://localhost:3001/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: comment,
        author: "사용자",
      }),
    }).then(() => {
      setComment("");
      fetch(`http://localhost:3001/posts/${post.id}/comments`)
        .then((res) => res.json())
        .then(setComments);
    });
  };

  // 댓글 삭제
  const deleteComment = (id) => {
    fetch(`http://localhost:3001/comments/${id}`, {
      method: "DELETE",
    }).then(() => {
      setComments(comments.filter((c) => c.id !== id));
    });
  };

  // 🔥 게시글 수정 저장
  const saveEdit = () => {
    fetch(`http://localhost:3001/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    }).then(() => {
      setIsEdit(false);
      onUpdate(); // 목록 새로고침
    });
  };

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={onClose}>← 목록</button>

      {isEdit ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
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
            <button
              className="danger"
              onClick={() => {
                if (!window.confirm("게시글을 삭제할까요?")) return;

                fetch(`http://localhost:3001/posts/${post.id}`, {
                  method: "DELETE",
                }).then(() => {
                  onDelete(post.id);
                  onClose();
                });
              }}
            >
              삭제
            </button>
          </div>
        </>
      )}

      <hr />

      <br></br>
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
        <button className="submit-btn" onClick={submitComment}>등록</button>
      </div>
    </div>
  );
}

export default PostDetail;