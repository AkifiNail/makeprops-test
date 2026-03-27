import axios from "axios";
import { useEffect, useState } from "react";

// export interface User{

// }

export default function Users() {
  const [user, setUser] = useState<[]>([]);

  const getUser = async () => {
    try {
      const reponse = await axios.post("http://localhost:3000/user/", {
        id: 1,
      });
      if (reponse.status === 200) {
        setUser(reponse.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const putUser = async () => {
    try {
      const reponse = await axios.put("http://localhost:3000/user/update", {
        id: 1,
      });
      if (reponse.status === 200) {
        console.log('modifié')
      }
    } catch (err) {
      console.error(err);
    }
  };

    const deleteUser = async () => {
    try {
      const reponse = await axios.delete("http://localhost:3000/user/delete", {
        data: {id: 1},
      });
      if (reponse.status === 200) {
        console.log('supprimé')
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <p>Users listes :</p>

      <button onClick={putUser}>Modifier</button>
      <button onClick={deleteUser}>Supprimé l'utilisateur 1</button>
    </>
  );
}
