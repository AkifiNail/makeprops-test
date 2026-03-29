import express, { application } from "express";
import { Router } from "express";
import { getDb } from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/id", async (req, res) => {
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

router.get("/", async (req, res) => {
  const db = getDb();
  try {
    const Alluser = await db.prepare(`SELECT * FROM users`);
    const alluserData = Alluser.all();
    if (!Alluser) {
      return res.json("Erreur lors de la récupération des users");
    }

    console.log(alluserData);

    res.json(alluserData);
  } catch (err) {
    console.error(err);
  }
});

router.post("/search", async (req, res) => {
  const { name, lastName, email } = req.body;
  const db = getDb();

  console.log(name, lastName, email);

  try {
    const getSearch = await db.prepare(
      `SELECT * FROM users WHERE name LIKE ? Or lastName LIKE ? Or email LIKE ?`,
    );

    const filteredData = await getSearch.all(
      `%${name}%`,
      `%${lastName}%`,
      `%${email}%`,
    );
    console.log(filteredData);
    res.json(filteredData);
  } catch (err) {
    console.error(err);
  }
});

router.post("/register", async (req, res) => {
  const db = getDb();
  const { name, lastName, email, password } = req.body;

  try {
    const ifUserExists = await db.prepare(
      `SELECT * FROM users WHERE (email) = (?)`,
    );

    const checkIfusersExist = ifUserExists.get(email);
    if (checkIfusersExist) {
      console.log("utilsiatuer existant");
      return res.json("utilisateur existe deja");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const addUsersReq = await db.prepare(
      `INSERT INTO users (name , lastName , email , password) VALUES(? , ? , ? , ?)`,
    );
    const addNewUser = addUsersReq.run(name, lastName, email, hashedPassword);

    console.log(addNewUser);
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
