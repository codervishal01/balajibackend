import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Balaji Healthcare Logo" 
              className="h-8 w-8"
            />
            <span className="font-heading text-xl font-bold text-foreground">Balaji Healthcare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Link and Call Button */}
          <div className="hidden md:flex items-center space-x-3">
            {user && isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </Button>
            )}
            {!user && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Admin Login</Link>
              </Button>
            )}
            <Button 
              size="lg"
              asChild 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <a href="tel:8279277040" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card rounded-lg mt-2 border border-border">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  Admin Panel
                </Link>
              )}
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  Admin Login
                </Link>
              )}
              <div className="pt-2">
                <Button 
                  size="lg"
                  asChild 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-md"
                >
                  <a href="tel:8279277040" className="flex items-center justify-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Call: 8279277040</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
