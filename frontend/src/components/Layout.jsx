import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

function Layout() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-aws-dark text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
              <span className="text-xl font-bold text-aws-orange">AWS</span>
              <span className="text-xl font-bold ml-2">Pricing Calculator</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/calculator"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
                  >
                    Calculator
                  </Link>
                  <Link
                    to="/estimates"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
                  >
                    My Estimates
                  </Link>
                  <span className="text-gray-300 text-sm">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-aws-orange text-white rounded-md text-sm font-medium hover:bg-orange-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-aws-orange text-white rounded-md text-sm font-medium hover:bg-orange-600 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} AWS Pricing Calculator. Built with React and Express.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
