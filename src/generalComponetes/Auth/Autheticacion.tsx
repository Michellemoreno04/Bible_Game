
import { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../firebase/firebase.config'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { setDoc,doc } from 'firebase/firestore'



export function AuthForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [vidas, setVidas] = useState<number>(3)
  const [monedas, setMonedas] = useState<number>(200)


  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setError(null)
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.')
    } finally {
      setIsLoading(false)
      window.location.href='/'
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
    const userCredential =  await  createUserWithEmailAndPassword(auth, email, password)
      
    if (!userCredential.user) return; // Si no hay usuario, salimos de la función

    // Accedemos al user correctamente desde userCredential.user
    const user = userCredential.user;
    
    // Creación del documento en Firestore con el UID del usuario
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        uid: user.uid,
        name: name,
        email: user.email,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || null,
        createdAt: new Date(),
        vidas:vidas,
        monedas: monedas
    });

      setError(null)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
      window.location.href='/'

    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    const provider = new GoogleAuthProvider()
    try {
     const userCredential= await signInWithPopup(auth, provider)
       
    if (!userCredential.user) return; // Si no hay usuario, salimos de la función

    // Accedemos al user correctamente desde userCredential.user
    const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || null,
          createdAt: new Date(),
          vidas:vidas,
          monedas: monedas
      },{merge: true});

      setError(null)
    } catch (error) {
      setError('Error al iniciar sesión con Google.')
    } finally {
      setIsLoading(false)
      window.location.href='/'
    }
  }

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
    <Card className="w-[350px] shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Bienvenido</CardTitle>
        <CardDescription className="text-center">
          Inicia sesión o crea una cuenta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input id="email" type="email" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <h2>Loading...</h2>
                ) : "Iniciar Sesión"}
              </Button>
            </form>
          </TabsContent>
          {/* SIGNUP ***********************************/}
          <TabsContent value="signup">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-medium">Nombre</Label>
                <Input id="signup-name" type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />

              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                <Input id="signup-email" type="email" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-medium">Contraseña</Label>
                <Input id="signup-password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                       <h2>Loading...</h2>                ) : "Crear Cuenta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>
        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isLoading}>
          {isLoading ? (
             <h2>Loading...</h2>
          ) : (
            <>
               
              Google
            </>
          )}
        </Button>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </CardFooter>
    </Card>
    </div>
  )
}