import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Use Cases', href: '#use-cases' },
    { name: 'Documentation', href: '#docs' },
    { name: 'Support', href: '#support' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-sm' : 'bg-white/95'
      } backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <Phone className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">VoiceAI</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Free Trial
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200">
              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-blue-600"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/register')}
                className="w-full justify-start mt-2 bg-blue-600 hover:bg-blue-700"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};