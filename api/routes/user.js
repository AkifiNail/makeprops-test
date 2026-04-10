import express, { application } from "express";
import { Router } from "express";
import { getDb } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateToken from "../middlewares/authMiddlewares.js";

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

    // console.log(alluserData);

    res.json(alluserData);
  } catch (err) {
    console.error(err);
  }
});

router.post("/search", async (req, res) => {
  const { name, lastName, email } = req.body;
  const db = getDb();

  try {
    const getSearch = await db.prepare(
      `SELECT * FROM users WHERE name LIKE ? Or lastName LIKE ? Or email LIKE ?`,
    );

    const filteredData = await getSearch.all(
      `%${name}%`,
      `%${lastName}%`,
      `%${email}%`,
    );
    res.json(filteredData);
  } catch (err) {
    console.error(err);
  }
});

router.post("/register", async (req, res) => {
  const db = getDb();
  const { name, lastName, email, password, photo } = req.body;
  // better-sqlite3: objects (e.g. {} from JSON-serialized File) are treated as
  // binding maps, not scalar values — use only string | null for ? placeholders.
  const photoForDb =
    typeof photo === "string" && photo.length > 0 ? photo : null;

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
      `INSERT INTO users (name , lastName , email , password , photo) VALUES(? , ? , ? , ? , ?)`,
    );
    const addNewUser = addUsersReq.run(
      name,
      lastName,
      email,
      hashedPassword,
      photoForDb,
    );

    console.log(addNewUser);
    res.json("Utilisateur créer");
  } catch (err) {
    console.error(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();

  try {
    const userReq = await db.prepare(`SELECT * FROM users WHERE email = ?`);
    const user = userReq.get(email);

    if (!user) {
      console.log("utilisateur introuvabke");
      return res.json("utilisateur introuvable");
    }

    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return res.json("le mots de passe ne correspond pas");
      }

      console.log("next");
      const accesstoken = jwt.sign({ user: user.id }, "clésupersecrete");

      res.json({ user: user.email, accesstoken: accesstoken });
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/auth", validateToken, async (req, res) => {
  console.log("test");
  const db = getDb();
  try {
    const getUserReq = await db.prepare(`SELECT * FROM users WHERE id = ?`);
    const userLogged = getUserReq.get(req.user);
    res.json({
      email: userLogged.email,
      nom: userLogged.lastName,
      prenom: userLogged.name,
    });
  } catch (err) {
    console.error(err);
  }
});

router.put("/me", validateToken, async (req, res) => {
  const { email } = req.body;
  const db = await getDb();
  try {
    const userReq = await db.prepare(`
      SELECT * FROM users WHERE id = ?
      `);

    const user = userReq.get(req.user);

    console.log(user);

    if (!user) {
      return res.json({ error: "erreur utilisateur introuvable" });
    }

    res.json(user);

    const updateUserReq = await db.prepare(
      `UPDATE users SET email = ? WHERE id = ?`,
    );
    const updateUser = updateUserReq.run(email, req.user);

    // console.log(updateUser);
  } catch (err) {
    console.log(err);
  }

  console.log(req.user);
});

// router.post("/add", async (req, res) => {
//   const db = getDb();
//   try {
//   } catch (err) {
//     console.error(err);
//   }
// });

export default router;
