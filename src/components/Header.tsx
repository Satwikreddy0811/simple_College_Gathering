import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-college-blue text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold flex items-center">
          <User className="h-7 w-7 mr-2 text-college-gold" />
          <span className="text-college-gold">College</span>
          <span className="ml-1">Events</span>
        </Link>
        
        <nav>
          <ul className="flex space-x-2 md:space-x-6 items-center">
            <li>
              <Link 
                to="/" 
                className={`hover:text-college-gold transition-colors ${
                  location.pathname === "/" ? "text-college-gold" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/events" 
                className={`hover:text-college-gold transition-colors ${
                  location.pathname === "/events" ? "text-college-gold" : ""
                }`}
              >
                Events
              </Link>
            </li>
            
            {user ? (
              <>
                <li>
                  <Link 
                    to="/admin" 
                    className={`hover:text-college-gold transition-colors ${
                      location.pathname === "/admin" ? "text-college-gold" : ""
                    }`}
                  >
                    Admin
                  </Link>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    onClick={handleLogout}
                    className="hover:text-college-gold transition-colors flex items-center gap-2"
                  >
                    <span>Logout</span>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button 
                  variant="ghost" 
                  className="hover:text-college-gold transition-colors flex items-center gap-2"
                  asChild
                >
                  <Link to="/auth">
                    <span>Login</span>
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
