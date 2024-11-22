import lifes from "../imagenes/lifes.png";
import coins from "../imagenes/coins.png";
import { UserMenu } from "../Perfil/userMenu";
import { useAuth } from "@/firebase/authContext";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { Link } from "react-router-dom";

export const NavbarComponent = () => {
  const { user } = useAuth();
  
  const [vidas, setVidas] = useState(); 
  const [monedas, setMonedas] = useState(); 
  const [name, setName] = useState();

  useEffect(() => {
    if (!user) return; // Si el usuario no está autenticado, no hacemos nada

    // Referencia al documento del usuario en Firestore
    const docRef = doc(db, "users", user.uid);

    // Configuramos el listener para obtener datos en tiempo real
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setVidas(data.vidas || 0); // Actualizamos vidas con el valor de la BD o 0 si no existe
        setMonedas(data.monedas || 0); // Actualizamos monedas con el valor de la BD o 0 si no existe
        setName(data.name || "");

      } else {
        console.log("No se encontró el documento del usuario.");
      }
    });

    // Limpiamos el listener al desmontar el componente
    return () => unsubscribe();
  }, [user]);

  if (!user) return;

  return (
    <nav className="w-full h-10 flex flex-row justify-end gap-5">
      <Link to={"/"}>
      <p className="absolute left-5 text-2xl text-sky-400">
        {'Hola, ' + (user.displayName || name)}
      </p>
      </Link>
      <div className="flex flex-row items-center gap-1">
        <img src={lifes} alt="Life" className="w-5 h-5"/>
        <span className="text-2xl font-bold text-red-500">{vidas}</span>
      </div>

      <div className="flex flex-row items-center gap-1">
        <img src={coins} alt="Coins" className="w-5 h-5"/>
        <span className="text-2xl font-bold text-red-500">{monedas}</span>
      </div>

      <div className="flex flex-row items-center">
        <UserMenu/>
      </div>
    </nav>
  );
};
