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
  const  [isLoading, setisLoading] = useState(false)

  const getAllUser = async () => {
    setisLoading(true)
    try {
      const reponse = await axios.get("http://localhost:3000/user/");
      if (reponse.status === 200) {
        setUser(reponse.data);
        setisLoading(false)
      
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

  
  const AddUsers = async () => {
     try {
      const reponse = await axios.post("http://localhost:3000/user/register", {
        name: 'nail',
        lastName: "akifi",
        email: "nail.akifi123@gamil.com",
        password : "password123"
      });
      if (reponse.status === 200) {
        
      }
    } catch (err) {
      console.error(err); 
    }

  }

  const handleLogin = async () => {
    try{
      const reponse = await axios.post("http://localhost:3000/user/login" , {
        email: "nail.akifi123@gamil.com",
        password : "password123"
      })

      if (reponse.status === 200){
        console.log(reponse.data)
        console.log(reponse.data.accessToken);
        localStorage.setItem("accessToken" , reponse.data.accesstoken)
      }



    }catch(err){
 console.error(err);
    }
  }

  const handleMe = async () => {

    try{
       
      const reponse = await axios.put("http://localhost:3000/user/me" , {
        
        email: "lucie.akifi123@gamil.com",
        password : "password1232"
      },{
        headers : {
          accesstoken: localStorage.getItem("accessToken"),

        },
      }
    )

      console.log(reponse.data)

         console.log("test1")



    }catch(err){
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

      <button>Suivant</button>
      <button>Précedent</button>

      <button onClick={putUser}>Modifier</button>
       <button onClick={SearchTerm}>Rechercher</button>
      <button onClick={deleteUser}>Supprimé l'utilisateur 1</button>
      <button onClick={AddUsers}>Ajouter l'utilisateur</button>
      <button onClick={handleMe}>Modifier l'user</button>

         <button onClick={handleLogin}>Auth</button>

    </>
  );
}
