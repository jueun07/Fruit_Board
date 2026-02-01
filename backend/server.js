const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/* ---------------- 게시글 ---------------- */
app.get("/posts", (req, res) => {
  const sql = "SELECT * FROM posts ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/posts", (req, res) => {
  const { title, content, author, is_pinned } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "title과 content는 필수입니다." });
  }

  const sql = `
    INSERT INTO posts (title, content, author, is_pinned)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, content, author || "사용자", is_pinned ?? 0],
    (err, result) => {
      if (err) {
        console.error("INSERT 에러:", err);
        return res.status(500).json(err);
      }
      res.status(201).json({ id: result.insertId, message: "저장 성공" });
    }
  );
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM posts WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DELETE 에러:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "삭제 성공", affectedRows: result.affectedRows });
  });
});

/* ---------------- 댓글 ---------------- */
/**
 * 1) 특정 게시글의 댓글 목록 조회
 * GET /posts/:id/comments
 */
app.get("/posts/:id/comments", (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isFinite(postId)) {
    return res.status(400).json({ message: "post id가 올바르지 않습니다." });
  }

  const sql = `
    SELECT id, post_id AS postId, content, author, created_at AS createdAt
    FROM comments
    WHERE post_id = ?
    ORDER BY created_at ASC
  `;

  db.query(sql, [postId], (err, results) => {
    if (err) {
      console.error("COMMENTS SELECT 에러:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

/**
 * 2) 댓글 작성
 * POST /posts/:id/comments
 * body : { content, author }
 */
app.post("/posts/:id/comments", (req, res) => {
  const postId = Number(req.params.id);
  const { content, author } = req.body;

  if (!Number.isFinite(postId)) {
    return res.status(400).json({ message: "post id가 올바르지 않습니다." });
  }
  if (!content) {
    return res.status(400).json({ message: "content는 필수입니다." });
  }

  const sql = `
    INSERT INTO comments (post_id, content, author)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [postId, content, author || "사용자"], (err, result) => {
    if (err) {
      console.error("COMMENTS INSERT 에러:", err);
      return res.status(500).json(err);
    }
    res.status(201).json({ id: result.insertId, message: "댓글 저장 성공" });
  });
});

/**
 * 3) 댓글 삭제(옵션)
 * DELETE /comments/:commentId
 */
app.delete("/comments/:commentId", (req, res) => {
  const commentId = Number(req.params.commentId);
  if (!Number.isFinite(commentId)) {
    return res.status(400).json({ message: "comment id가 올바르지 않습니다." });
  }

  const sql = "DELETE FROM comments WHERE id = ?";
  db.query(sql, [commentId], (err, result) => {
    if (err) {
      console.error("COMMENTS DELETE 에러:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "댓글 삭제 성공", affectedRows: result.affectedRows });
  });
});

/* ---------------- 테스트 ---------------- */
app.get("/api/test", (req, res) => {
  res.json({ message: "프론트랑 연결 성공!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});