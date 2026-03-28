import axios from "axios";
import { useEffect, useState } from "react";

export interface User{
  id: number,
  name: string,
  lastName: string,
  email: string,
  password: string,

}

export default function Users() {
  const [user, setUser] = useState<User[]>([]);

  const getAllUser = async () => {
    try {
      const reponse = await axios.get("http://localhost:3000/user/");
      if (reponse.status === 200) {
        setUser(reponse.data);
      
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  console.log(user);
}, [user]);

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


  const SearchTerm = async () => {
     try {
      const reponse = await axios.post("http://localhost:3000/user/search", {
        name: 'du',
        lastName: null,
        email: null,
      });
      if (reponse.status === 200) {
        
      }
    } catch (err) {
      console.error(err); 
    }

  }


  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <>
      <p>Users listes :</p>
      {user.map((user , index) => (
      <p key={index}>{index + 1} - {user.name}</p>
      ))}

      <button onClick={putUser}>Modifier</button>
       <button onClick={SearchTerm}>Rechercher</button>
      <button onClick={deleteUser}>Supprimé l'utilisateur 1</button>
    </>
  );
}
