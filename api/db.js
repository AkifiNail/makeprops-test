import Database from "better-sqlite3";

let dbInstance = null;

export async function initDb() {
  const fileMustExist = false;
  dbInstance = new Database("db/database.sqlite", { fileMustExist });
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    name       STRING  NOT NULL,
    lastName   STRING  NOT NULL,
    email      STRING  NOT NULL,
    password   STRING  NOT NULL,
    CreatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) `);

  //   const dataUser = await dbInstance.exec(`
  //         INSERT INTO users (id , name , lastName , email , password) VALUES(1, 'dupont' , 'jean' , 'dupont@gmail.com' , 1234)`);
  //   const adopt = dbInstance.transaction((cats) => {
  //     dataUser.run();
  //   });
}

export function getDb() {
  if (!dbInstance) {
    return;
  }
  return dbInstance;
}
