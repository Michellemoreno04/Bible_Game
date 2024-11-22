import { LLM } from "./generalComponetes/LLM/LLM"
import Preguntas from "./generalComponetes/preguntas/preguntasPage"
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import { ResultadoPuntuacion } from "./generalComponetes/preguntas/puntuacion"
import UserProfile from "./generalComponetes/Perfil/perfil"
import { AuthForm } from "./generalComponetes/Auth/Autheticacion"
import { useAuth } from "./firebase/authContext"
import GameSection from "./generalComponetes/Game_section/Game_section"
import { Dashboard } from "./generalComponetes/Dashboart/dashboart"

function App() {
  
  const {user} =useAuth()
  
  const navigate = useNavigate()
  const ProtectedRoute = ({ element: Component }) => {
   
  if (!user) {
    navigate('/auth')
  }
    
  };

  return (
   <div>

  
      <Routes >
        <Route path="/" element={<GameSection/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/quiz" element={<Preguntas />} />
        <Route path="/LLM" element={<LLM />} />
        <Route path="/result" element={<ResultadoPuntuacion/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/profile/:userId" element={<UserProfile/>} />
        <Route path="/auth" element={<AuthForm/>} />
      </Routes>

   </div>
  )
}

export default App
