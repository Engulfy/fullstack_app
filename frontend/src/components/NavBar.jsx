import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();
  
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">☕</span>
            <h1 className="text-xl font-bold">Cafe Manager</h1>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              to="/cafes" 
              className={`px-3 py-2 rounded transition ${
                location.pathname === '/cafes' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'
              }`}
            >
              Cafes
            </Link>
            <Link 
              to="/employees" 
              className={`px-3 py-2 rounded transition ${
                location.pathname === '/employees' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'
              }`}
            >
              Employees
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}