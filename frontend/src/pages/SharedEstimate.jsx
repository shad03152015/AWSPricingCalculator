import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

function SharedEstimate() {
  const { shareToken } = useParams();
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [sharedBy, setSharedBy] = useState('');

  const fetchSharedEstimate = async (pwd = null) => {
    try {
      setLoading(true);
      setError(null);

      const params = pwd ? `?password=${encodeURIComponent(pwd)}` : '';
      const response = await api.get(`/shared/${shareToken}${params}`);

      setEstimate(response.data.estimate);
      setSharedBy(response.data.sharedBy);
      setLoading(false);
    } catch (err) {
      if (err.response?.data?.requiresPassword) {
        setRequiresPassword(true);
        setLoading(false);
      } else {
        setError(err.response?.data?.error || 'Failed to load shared estimate');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSharedEstimate();
  }, [shareToken]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    fetchSharedEstimate(password);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-aws-orange"></div>
          <p className="mt-4 text-gray-600">Loading shared estimate...</p>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Required</h2>
          <p className="text-gray-600 mb-6">
            This estimate is password protected. Please enter the password to view it.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-aws-orange text-white py-2 px-4 rounded-md hover:bg-orange-600 transition font-medium"
            >
              Submit
            </button>
          </form>
          {error && (
            <p className="mt-4 text-red-600 text-sm">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {estimate?.name}
          </h1>
          {estimate?.description && (
            <p className="text-gray-600 mb-4">{estimate.description}</p>
          )}
          <p className="text-sm text-gray-500">
            Shared by <span className="font-medium">{sharedBy}</span>
          </p>
        </div>

        {/* Cost Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Cost Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Monthly Cost</p>
              <p className="text-3xl font-bold text-aws-orange">
                ${estimate?.totalMonthlyCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Annual Cost</p>
              <p className="text-3xl font-bold text-gray-700">
                ${estimate?.totalAnnualCost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Services</h2>
          <div className="space-y-4">
            {estimate?.services.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                    <p className="text-sm text-gray-600">Region: {service.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-aws-orange">
                      ${service.monthlyCost.toFixed(2)}/mo
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharedEstimate;
