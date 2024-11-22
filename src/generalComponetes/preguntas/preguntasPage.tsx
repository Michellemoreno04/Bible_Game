import axios from 'axios'
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { questionsObject } from "./objectPreguntas";
import { NavbarComponent } from "../Navbar/NavbarComponent";
import Swal from "sweetalert2";
import { setDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import coins from "../imagenes/coins.png";
import { useAuth } from "@/firebase/authContext";



interface Recursos {
  monedas: number;
  vidas: number;
}

interface Question {
  question: string;
  correctAnswer: string;
  options: string[];
  id: number;
  reference: any;
}

export default function Preguntas() {
  
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [filteredOptions, setFilteredOptions] = useState<string[] | null>(null);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isRemovingTwo, setIsRemovingTwo] = useState(false);
  
  const [recursos, setRecursos] = useState<Recursos>({ monedas: 200, vidas: 3 });


  
// Llamada al backend para obtener una pregunta generada por IA
const fetchQuestion = async () => {
  try {
    const response = await axios.post('http://localhost:3001/generateQuestion');
    const newQuestion = response.data;
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  } catch (error) {
    console.error('Error al obtener la pregunta de IA:', error);
  }
};

useEffect(() => {
  // Obtener la primera pregunta al montar el componente
  fetchQuestion();
}, []);



  useEffect(() => {


    const fetchRecursos = async () => {
      try {
        const userDoc = onSnapshot(doc(db, "users", user?.uid || ""), (doc) => {
          if (doc.exists()) {
            const userData = doc.data() as Recursos;
            setRecursos(userData);
          }
        });
      } catch (error) {
        console.error("Error al obtener monedas:", error);
      }
    };
    if (user) {
      fetchRecursos();
    }

   
  }, [user]);

  


  const preguntaActual = questions[currentQuestion]?.question;
  const correctAnswer = questions[currentQuestion]?.correctAnswer;
  const incorrectAnswer = questions[currentQuestion]?.options || [];

  async function nextQuestion(option: string) {
    setSelectedOption(option);
    setFilteredOptions(null);

    if (option === correctAnswer) {
      const newScore = score + 10;
      setScore(newScore);

      setTimeout(async () => {
        setSelectedOption(null);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          await setDoc(
            doc(db, "users", user?.uid || ""),
            {
              vidas: recursos.vidas,
              monedas: recursos.monedas,
              Score: newScore,
            },
            { merge: true }
          );

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Tu progreso ha sido guardado",
            showConfirmButton: true,
          }).then(() => {
            window.location.href = "/result";
          });
        }
      }, 1000);
    } else {
      const newVidas = Math.max(recursos.vidas - 1, 0); // Limitar a un mínimo de 0

      setRecursos({ ...recursos, vidas: newVidas });

      try {
        await setDoc(
          doc(db, "users", user?.uid || ""),
          {
            vidas: newVidas,
          },
          { merge: true }
        );
       if (newVidas === 0) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ya no tienes vidas suficientes",
            showConfirmButton: true,
          }).then(() => {
            window.location.href = "/result";
          });
        }

        setTimeout(() => {
          setSelectedOption(null);
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          } else {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Tu progreso ha sido guardado",
              showConfirmButton: true,
            }).then(() => {
              window.location.href = "/result";
            });
          }
        }, 1000);
      } catch (error) {
        console.error("Error al actualizar las vidas en la base de datos:", error);
        Swal.fire("Error al actualizar las vidas", "", "error");
      }
    }
  }

  const skipQuestion = async () => {
    if (isSkipping || recursos.monedas < 15) return;
    setIsSkipping(true);

    const newMonedas = recursos.monedas - 15;
    setRecursos({ ...recursos, monedas: newMonedas });

    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          monedas: newMonedas,
        });
      } catch (error) {
        console.error("Error al actualizar las monedas en la base de datos:", error);
        Swal.fire("Error al actualizar las monedas");
      }
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setSelectedOption(null);
        setFilteredOptions(null);
        setCurrentQuestion(currentQuestion + 1);
        setIsSkipping(false);
      }, 1000);
    } else {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Tu progreso ha sido guardado",
        showConfirmButton: true,
      }).then(() => {
        window.location.href = "/result";
      });
    }
  };

  const removeTwoWrongs = async () => {
    if (isRemovingTwo || recursos.monedas < 25) return;
    setIsRemovingTwo(true);

    const newMonedas = recursos.monedas - 25;
    setRecursos({ ...recursos, monedas: newMonedas });

    if (user) {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          { monedas: newMonedas },
          { merge: true }
        );

        const incorrectOptions = incorrectAnswer.filter((opt) => opt !== correctAnswer);
        const randomIncorrectOption = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
        setFilteredOptions([correctAnswer, randomIncorrectOption]);
      } catch (error) {
        console.error("Error al actualizar las monedas en la base de datos:", error);
        Swal.fire("Error al actualizar las monedas", "", "error");
      }
    }

    setTimeout(() => {
      setIsRemovingTwo(false);
    }, 1000);
  };

  if(!questions[currentQuestion]){
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <NavbarComponent />
      <Card className="w-full bg-white rounded-xl shadow-lg">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {questions[currentQuestion].reference}
            </div>
          </div>

          <div className="w-full h-[300px] flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/100" />
            <img
              src="https://th.bing.com/th/id/OIP.BicPaSyriQZ_UG4yq0gCQgHaE8?w=239&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="Biblical Illustration"
              className="w-[60%] h-[300px] object-cover rounded-xl"
            />
          </div>

          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-slate-800">
              {preguntaActual}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {(filteredOptions || incorrectAnswer).map((option, index) => (
                <button
                  key={index}
                  className={`w-full justify-between px-4 py-3 text-left rounded border hover:bg-slate-200 hover:scale-105 transition-transform duration-300 ${
                    selectedOption === option
                      ? option === correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => nextQuestion(option)}
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>

            <div className="w-full flex flex-row gap-2 items-center justify-center">
              <button
                className="w-40 h-20 flex flex-rows justify-center items-center bg-blue-700 hover:bg-blue-600 rounded"
                onClick={skipQuestion}
              >
                <span className="w-full flex flex-col items-center justify-center text-white">
                  <span className="w-full flex flex-row items-center justify-center">
                    <img src={coins} className="w-5" />
                    <span className="text-2xl m-1">15</span>
                  </span>
                  Skip
                </span>
              </button>

              <button
                className="w-40 h-20 flex flex-rows justify-center items-center bg-red-700 hover:bg-red-600 rounded"
                onClick={removeTwoWrongs}
              >
                <span className="w-full flex flex-col items-center justify-center text-white">
                  <span className="w-full flex flex-row items-center justify-center">
                    <img src={coins} className="w-5" />
                    <span className="text-2xl m-1">25</span>
                  </span>
                  Remove 2 wrongs
                </span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
