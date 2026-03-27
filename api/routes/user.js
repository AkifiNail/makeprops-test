import express, { application } from "express";
import { Router } from "express";
import { getDb } from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const db = getDb();
  const userId = req.body.id;
  if (!userId || typeof userId !== "number") {
    return res.json("erreur lors de la récupération du body");
  }
  try {
    const allUsers = await db.prepare(`SELECT * FROM users WHERE (id) =  (?)`, [
      userId,
    ]);

    if (!allUsers) {
      return res.json("utilisateur introuvable");
    }
    console.log(allUsers.get(userId));
  } catch (err) {
    console.error(err);
    res.status(404).json("Erreur lors de la req");
  }
});

router.put("/update", async (req, res) => {
  console.log("la requete");
  const db = getDb();
  const userId = req.body.id;

  //   console.log(userId);

  try {
    const users = await db.prepare(
      `UPDATE users
SET name = 'loic', lastName = 'Schmit'
WHERE (id) = (?)`,
    );

    users.run(userId);

    if (!users) {
      return res.json("utilisateur introuvable");
    }
  } catch (err) {
    console.error(err);
  }
});

router.delete("/delete", async (req, res) => {
  const db = getDb();
  const userId = req.body.id;

  if (!userId || typeof userId !== "number") {
    return res.json("erreur lors de la récupération du body");
  }

  try {
    const deleteUser = await db.prepare(`
        DELETE FROM users WHERE id = (?) `);
    if (!deleteUser) {
      return res.json("utilisateur introuvable");
    }

    deleteUser.run(userId);
  } catch (err) {
    console.error(err);
  }
});

// router.post("/add", async (req, res) => {
//   const db = getDb();
//   try {
//   } catch (err) {
//     console.error(err);
//   }
// });

export default router;
