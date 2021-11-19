const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM graduates");
    return res.json(result.rows);
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await db.query(
      "INSERT INTO graduates (name) VALUES ($1) RETURNING *",
      [req.body.name]
    );
    return res.json(result.rows[0]);
  } catch (e) {
    return next(e);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const result = await db.query(
      "UPDATE graduates SET name=$1 WHERE id=$2 RETURNING *",
      [req.body.name, req.params.id]
    );
    return res.json(result.rows[0]);
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await db.query(
      "DELETE FROM graduates WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    return res.json(result.rows[0]);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;