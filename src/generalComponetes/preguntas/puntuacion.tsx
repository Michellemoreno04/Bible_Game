import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Award } from 'lucide-react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { useEffect, useState } from "react";
import { NavbarComponent } from "../Navbar/NavbarComponent";
import { useAuth } from "@/firebase/authContext";

export function ResultadoPuntuacion({ userName = "Usuario", score = 0 }: { userName?: string; score?: number }) {
  const { user } = useAuth();
  const [actualScore, setScore] = useState(0); // Cambiado a un valor inicial numérico

  const determinarPremio = (puntuacion: number) => {
    if (puntuacion >= 100) return { nombre: "Oro", color: "bg-yellow-500 text-yellow-900", icon: Trophy };
    if (puntuacion >= 50) return { nombre: "Plata", color: "bg-gray-300 text-gray-800", icon: Star };
    if (puntuacion >= 25) return { nombre: "Bronce", color: "bg-orange-400 text-orange-900", icon: Zap };
    return { nombre: "Participación", color: "bg-blue-400 text-blue-900", icon: Award };
  };

  useEffect(() => {
    if (!user) return; // Aseguramos que el hook siempre esté definido, pero solo ejecutamos si el usuario existe

    // Referencia al documento que contiene el score del usuario autenticado
    const docRef = doc(db, "users", user.uid);

    // Configuramos el listener para escuchar en tiempo real
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setScore(doc.data().Score); // Actualizamos el estado con el score actual de la DB
      } else {
        console.log("No se encontró el documento.");
      }
    });

    // Limpiamos el listener al desmontar el componente
    return () => unsubscribe();
  }, [user]);

  // Si el usuario no está autenticado, muestra un mensaje de carga
  if (!user) {
    return <h1>Loading...</h1>;
  }

  const premio = determinarPremio(actualScore); // Usa actualScore en lugar de score
  const Icon = premio.icon;

  return (
    <div className="w-full ">
      <NavbarComponent />
      <div className="min-h-screen flex items-center justify-center bg-blue-900">
        <Card className="w-full max-w-md mx-auto overflow-hidden shadow-2xl bg-blue-800 border-blue-600">
          <CardHeader className="text-center relative pb-2">
            <CardTitle className="text-3xl font-extrabold text-blue-100">
              {userName}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 pt-4 pb-6 px-4">
            <div className="text-7xl font-black text-blue-100 flex items-baseline">
              {actualScore}
              <span className="text-2xl font-bold text-blue-300 ml-2">pts</span>
            </div>
            <Badge className={`${premio.color} px-4 py-2 text-lg font-semibold rounded-full shadow-lg`}>
              <Icon className="w-6 h-6 mr-2 inline-block" />
              {premio.nombre}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
