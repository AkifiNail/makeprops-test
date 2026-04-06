import jwt from "jsonwebtoken";
export default function validateToken(req, res, next) {
  const accessToken = req.header("accessToken");
  if (!accessToken) {
    return res.json("utilisateur non identifié");
  }
  console.log(accessToken);
  try {
    const verifiedToken = jwt.verify(accessToken, "clésupersecrete");
    if (!verifiedToken) {
      return res.json("Mauvaise identité");
    }

    req.user = verifiedToken.user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Token invalide" });
  }
}
