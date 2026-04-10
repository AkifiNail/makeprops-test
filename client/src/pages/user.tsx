import axios from "axios";
import React, { useEffect, useState } from "react";

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  photo: File;
}

export default function Users() {
  const [user, setUser] = useState<User[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [searchTerm, SetSearchTerm] = useState("");
  const [userValue, setuserValue] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    photo: null as File | null,
  });

  const [authUser, setAuthUser] = useState();

  const [message, setMessage] = useState("");

  const maxStep = Math.ceil(user.length / 3) - 1;

  const filterdUser = user.filter((n) =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const increaseStep = () => {
    setStep((prev) => (prev > maxStep ? 0 : prev + 1));
  };
  const decreaseStep = () => {
    setStep((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  const getAllUser = async () => {
    setisLoading(true);
    try {
      const reponse = await axios.get("http://localhost:3000/user/");
      if (reponse.status === 200) {
        setUser(reponse.data);
        setisLoading(false);
      }
    } catch (err) {
      console.error(err);
      setisLoading(false);
    }
  };

  useEffect(() => {
    console.log(authUser);
  }, [authUser]);

  const auth = async () => {
    console.log("test")
    try {
      const reponse = await axios.get("http://localhost:3000/user/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken")
        },
      });

      if (reponse.status === 200) {
        setAuthUser(reponse.data);
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
        console.log("modifié");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async () => {
    try {
      const reponse = await axios.delete("http://localhost:3000/user/delete", {
        data: { id: 1 },
      });
      if (reponse.status === 200) {
        console.log("supprimé");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const SearchTerm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const reponse = await axios.post("http://localhost:3000/user/search", {
        name: searchTerm,
        lastName: null,
        email: null,
      });
      if (reponse.status === 200) {
        setUser(reponse.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const AddUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userValue);

    try {
      const reponse = await axios.post("http://localhost:3000/user/register", {
        name: userValue.prenom,
        lastName: userValue.nom,
        email: userValue.email,
        password: userValue.password,
        photo: userValue.photo,
      });

      if (reponse.status === 200) {
        setMessage(reponse.data);
      }
      console.log(userValue);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      const reponse = await axios.post("http://localhost:3000/user/login", {
        email: "nail.akifi123@gamil.com",
        password: "a",
      });

      if (reponse.status === 200) {
        localStorage.setItem("accessToken", reponse.data.accesstoken);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMe = async () => {
    try {
      const reponse = await axios.put(
        "http://localhost:3000/user/me",
        {
          email: "lucie.akifi123@gamil.com",
        },
        {
          headers: {
            accesstoken: localStorage.getItem("accessToken"),
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    auth();
    getAllUser();
    
  }, []);

  return (
    <>
      <p>Users listes :</p>
      <p>Rechercher : </p>
      <form onSubmit={SearchTerm}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => SetSearchTerm(e.target.value)}
        ></input>
        <button>Envoyer</button>
      </form>
      {isLoading && <p>Chargement</p>}
      {filterdUser.slice(step * 3, step * 3 + 3).map((user, index) => (
        <p key={index}>
          {index + 1} - {user.name}
        </p>
      ))}

      <button onClick={increaseStep}>Suivant</button>
      <button onClick={decreaseStep}>Précedent</button>

      <button onClick={putUser}>Modifier</button>
      {/* <button onClick={SearchTerm}>Rechercher</button> */}
      <button onClick={deleteUser}>Supprimé l'utilisateur 1</button>
      <button onClick={handleMe}>Modifier l'user</button>

      <button onClick={handleLogin}>Auth</button>

      <form onSubmit={AddUsers}>
        {message && <p>{message}</p>}
        <label>Prénom</label>
        <input
          type="text"
          value={userValue.prenom}
          onChange={(e) =>
            setuserValue((prev) => ({
              ...prev,
              prenom: e.target.value,
            }))
          }
        ></input>
        <label>Nom</label>
        <input
          type="text"
          value={userValue.nom}
          onChange={(e) =>
            setuserValue((prev) => ({
              ...prev,
              nom: e.target.value,
            }))
          }
        ></input>
        <label>Email</label>
        <input
          type="email"
          value={userValue.email}
          onChange={(e) =>
            setuserValue((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        ></input>
        <label>Password</label>
        <input
          type="password"
          value={userValue.password}
          onChange={(e) =>
            setuserValue((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
        ></input>

        <label>Photo</label>
        <input
          type="file"
          // value={userValue.photo}
          onChange={(e) =>
            setuserValue((prev) => ({
              ...prev,
              photo: e.target.files?.[0] || null,
            }))
          }
        ></input>

        <button>Créer un user</button>
      </form>
    </>
  );
}
