// AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase.config';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
// Crea el contexto
const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Controla si estamos cargando el estado de autenticación
const navigate = useNavigate()

  useEffect(() => {
    // Escucha los cambios de autenticación de Firebase solo una vez
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Cambia a false después de que tengamos un resultado (usuario o null)
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => console.error(error));
  };

  const logout = () => {
    auth.signOut()
      .then(() => setUser(null))
      .then(()=>navigate('/auth'))
      .catch((error) => console.error(error));
      
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
