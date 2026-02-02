import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function PostDetail({ post, onClose, onDelete, onUpdate }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  /* =====================
     댓글 불러오기
  ====================== */
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("댓글 조회 실패", error);
        return;
      }
      setComments(data);
    };

    fetchComments();
  }, [post.id]);

  /* =====================
     댓글 작성
  ====================== */
  const submitComment = async () => {
    if (!comment.trim()) return;

    const { error } = await supabase.from("comments").insert({
      post_id: post.id,
      content: comment,
      author: "사용자", // 추후 로그인 사용자로 교체 가능
    });

    if (error) {
      alert("댓글 등록 실패");
      console.error(error);
      return;
    }

    setComment("");

    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });

    setComments(data);
  };

  /* =====================
     댓글 삭제
  ====================== */
  const deleteComment = async (id) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) {
      alert("댓글 삭제 실패");
      console.error(error);
      return;
    }

    setComments(comments.filter((c) => c.id !== id));
  };

  /* =====================
     게시글 수정
  ====================== */
  const saveEdit = async () => {
    const { error } = await supabase
      .from("posts")
      .update({
        title: editTitle,
        content: editContent,
      })
      .eq("id", post.id);

    if (error) {
      alert("게시글 수정 실패");
      console.error(error);
      return;
    }

    setIsEdit(false);
    onUpdate();
  };

  /* =====================
     게시글 삭제
  ====================== */
  const deletePost = async () => {
    if (!window.confirm("게시글을 삭제할까요?")) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      alert("게시글 삭제 실패");
      console.error(error);
      return;
    }

    onDelete(post.id);
    onClose();
  };

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={onClose}>
        ← 목록
      </button>

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
            <button className="danger" onClick={deletePost}>
              삭제
            </button>
          </div>
        </>
      )}

      <hr />
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