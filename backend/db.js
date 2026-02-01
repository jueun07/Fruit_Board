const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "kimjueun0912",
  password: "kimjueun@1234",
  database: "fruit_board"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL 연결 실패", err);
    return;
  }
  console.log("✅ MySQL 연결 성공!");
});

module.exports = db;
