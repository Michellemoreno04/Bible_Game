import { useEffect, useState } from 'react'
import { User, Award, Book, Star, Trophy, Target } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NavbarComponent } from '../Navbar/NavbarComponent'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase.config'
import { useAuth } from '@/firebase/authContext'
import { useParams } from 'react-router-dom'





export default function UserProfile() {

  
 const { user } = useAuth()
const [userInfo, setUserInfo] = useState({});

const { userId } = useParams(); // userId viene de la URL como /perfil/:userId


  const [userData, setUserData] = useState({
    name: "María García",
    level: 7,
    points: 3500,
    questionsAnswered: 250,
    correctAnswers: 200,
    streak: 15,
    badges: ["Principiante", "Estudioso", "Perseverante"],
    achievements: [
      { name: "Génesis Maestro", description: "Respondió todas las preguntas de Génesis correctamente" },
      { name: "Maratón Bíblico", description: "Respondió 100 preguntas en un día" },
      { name: "Sabiduría de Salomón", description: "Alcanzó una racha de 30 respuestas correctas" }
    ]
  })

  const calculateAccuracy = () => {
    return ((userData.correctAnswers / userData.questionsAnswered) * 100).toFixed(1)
  }


  useEffect(() => {
    if (userId) {
      const docRef = doc(db, "users", userId); // userId de la URL
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            setUserInfo(doc.data());
          } else {
            console.log("No se encontró el documento del usuario.");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el documento del usuario:", error);
        });
    }
  }, [userId]);
  
  
  
  return (
    <div className="min-h-screen bg-slate-100 p-2">
      <NavbarComponent/>
      <Card className="w-full max-w-3xl  border-none mx-auto shadow-2xl bg-white">
        <CardHeader className="text-center bg-slate-500 text-white rounded-t-lg py-8">
          <div className="mx-auto bg-white text-blue-600 p-3 rounded-full w-24 h-24 flex items-center justify-center mb-4 shadow-lg">
            <User size={48} />
          </div>
          <CardTitle className="text-3xl font-bold">{userInfo.name || userInfo.displayName}</CardTitle>
          <CardDescription className="text-lg text-blue-100">Score: {userInfo.Score} - {userInfo.monedas} monedas</CardDescription>
        </CardHeader>
        {/* <CardContent className="p-6 bg-slate-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center bg-blue-50 p-3 rounded">
              <Book className="mr-2 text-blue-600" />
              <span className="text-blue-800">Preguntas respondidas: {userData.questionsAnswered}</span>
            </div>
            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
              <Target className="mr-2 text-blue-600" />
              <span className="text-blue-800">Precisión: {calculateAccuracy()}%</span>
            </div>
            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
              <Star className="mr-2 text-blue-600" />
              <span className="text-blue-800">Racha actual: {userData.streak} días</span>
            </div>
            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
              <Trophy className="mr-2 text-blue-600" />
              <span className="text-blue-800">Logros desbloqueados: {''}</span>
            </div>
          </div>

         

          <h3 className="font-semibold text-lg mb-2 text-blue-800">Insignias</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {/*userData.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 py-1 px-3">
                <Award className="mr-1 h-4 w-4" /> {badge}
              </Badge>
            ))}
          </div>

          <h3 className="font-semibold text-lg mb-2 text-blue-800">Logros</h3>
          <ul className="space-y-2">
            {/*userData.achievements.map((achievement, index) => (
              <li key={index} className="bg-blue-50 p-3 rounded-lg">
                <span className="font-medium text-blue-800">{achievement.name}</span>
                <p className="text-sm text-blue-600">{achievement.description}</p>
              </li>
            ))}
          </ul>
        </CardContent>*/}
      </Card>
    </div>
  )
}