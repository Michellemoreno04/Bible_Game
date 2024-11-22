"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { db } from "./../../firebase/firebase.config"
import { collection, addDoc } from "firebase/firestore"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  reference: string
}

interface Story {
  biblicalText: string
  questions: Question[]
}

export function Dashboard() {
  const [story, setStory] = useState<Story>({
    biblicalText: "",
    questions: []
  })

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: 1,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    reference: ""
  })

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const addQuestion = async () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt) && currentQuestion.correctAnswer && currentQuestion.reference) {
      const newStory = {
        ...story,
        questions: [...story.questions, currentQuestion]
      }
      
      try {
        await addDoc(collection(db, "stories"), newStory)
        console.log("Historia guardada en Firebase")
        
        setStory(newStory)
        setCurrentQuestion({
          id: currentQuestion.id + 1,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          reference: ""
        })
      } catch (error) {
        console.error("Error al guardar la historia:", error)
      }
    } else {
      alert("Por favor, complete todos los campos de la pregunta antes de agregar.")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Historias Bíblicas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Agregar Nueva Historia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="biblicalText">Texto Bíblico</Label>
              <Textarea
                id="biblicalText"
                value={story.biblicalText}
                onChange={(e) => setStory({ ...story, biblicalText: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <Card className="p-4">
              <div className="space-y-4">
                <Input
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  placeholder="Pregunta"
                />
                {currentQuestion.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Opción ${index + 1}`}
                  />
                ))}
                <Input
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  placeholder="Respuesta correcta"
                />
                <Input
                  value={currentQuestion.reference}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, reference: e.target.value })}
                  placeholder="Referencia bíblica"
                />
              </div>
            </Card>
            <Button onClick={addQuestion} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Agregar Pregunta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

