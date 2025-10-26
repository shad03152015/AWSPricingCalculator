import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEstimates } from '../store/slices/estimatesSlice';

function Estimate() {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector((state) => state.estimates);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      dispatch(fetchEstimates());
    }

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Estimates</h1>
            <p className="mt-2 text-lg text-gray-600">
              View and manage your saved cost estimates
            </p>
          </div>
          <Link
            to="/calculator"
            className="bg-aws-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 transition font-medium"
          >
            New Estimate
          </Link>
        </div>

        {/* Estimates Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange"></div>
            <p className="mt-4 text-gray-600">Loading estimates...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-red-600 mb-4">Error loading estimates: {error}</p>
            <button
              onClick={() => dispatch(fetchEstimates())}
              className="bg-aws-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 transition font-medium"
            >
              Retry
            </button>
          </div>
        ) : list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((estimate) => (
              <div
                key={estimate._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {estimate.name}
                </h3>
                {estimate.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {estimate.description}
                  </p>
                )}

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Monthly Cost:</span>
                    <span className="text-2xl font-bold text-aws-orange">
                      ${estimate.totalMonthlyCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Services:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {estimate.services.length}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created: {formatDate(estimate.createdAt)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 transition text-sm font-medium">
                    View
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-300 transition text-sm font-medium">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No estimates yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Create your first estimate to get started!
            </p>
            <Link
              to="/calculator"
              className="mt-6 inline-block bg-aws-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 transition font-medium"
            >
              Start Calculating
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Estimate;
