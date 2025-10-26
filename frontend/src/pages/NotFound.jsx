import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-aws-orange">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-aws-orange text-white px-8 py-3 rounded-md hover:bg-orange-600 transition font-medium"
        >
          Go to Calculator
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
