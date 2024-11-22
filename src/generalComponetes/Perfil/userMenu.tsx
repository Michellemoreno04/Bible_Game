
import { useState } from 'react'
import { User, LogOut, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/firebase/authContext'
import { useNavigate } from 'react-router-dom'


export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate()
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...')
    logout()
  }

  const viewProfile = () => {
    navigate('/profile/' + user.uid)

  }

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost"  className="relative w-10 h-10  rounded-full">
          <User size={48} color='blue' />
            {isOpen && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={viewProfile}>
            <User  className="mr-2 h-20 w-20 " />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}