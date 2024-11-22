import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Gamepad2 } from 'lucide-react'
import { Link } from "react-router-dom"
import { NavbarComponent } from "../Navbar/NavbarComponent"



export default function GameSection() {
  const games = [
    { name: "Examen de Biblico", icon: BookOpen },
    // Aquí puedes añadir más juegos en el futuro
  ]

  return (
    <div>

        <NavbarComponent />
    
    <section className="min-h-screen w-full bg-blue-900 flex flex-col items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Explora Nuestros Juegos</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {games.map((game, index) => (
            <Link to={'/quiz'} key={index} className="w-full md:w-1/2 lg:w-1/3 transform hover:scale-105 transition-transform duration-300">
              <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <BookOpen className="w-16 h-16 mb-6 text-blue-300" />
                  
                  <h3 className="text-xl font-semibold text-center text-white">{game.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
          {/* Placeholder para futuros juegos */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Card className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-lg border-none shadow-xl">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Gamepad2 className="w-16 h-16 mb-6 text-blue-200 opacity-50" />
                <h3 className="text-xl font-semibold text-center text-blue-200 opacity-50">Próximamente</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}