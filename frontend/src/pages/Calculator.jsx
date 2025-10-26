import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAvailableServices } from '../store/slices/calculatorSlice';

function Calculator() {
  const dispatch = useDispatch();
  const { availableServices, services, totalMonthlyCost } = useSelector((state) => state.calculator);

  useEffect(() => {
    dispatch(loadAvailableServices());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">AWS Pricing Calculator</h1>
          <p className="mt-2 text-lg text-gray-600">
            Configure AWS services and estimate your monthly costs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Service Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Select Services</h2>

              {availableServices.length > 0 ? (
                <div className="space-y-3">
                  {availableServices.map((service) => (
                    <div
                      key={service.code}
                      className="border border-gray-200 rounded-lg p-4 hover:border-aws-orange hover:shadow-md transition cursor-pointer"
                    >
                      <h3 className="font-semibold text-lg text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {service.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Loading services...
                </div>
              )}
            </div>
          </div>

          {/* Right: Cost Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-4">Cost Summary</h2>

              {services.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {services.map((service) => (
                      <div key={service.id} className="flex justify-between border-b pb-2">
                        <span className="text-sm text-gray-700">{service.serviceName}</span>
                        <span className="text-sm font-semibold">${service.monthlyCost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold">Monthly Total:</span>
                      <span className="text-2xl font-bold text-aws-orange">
                        ${totalMonthlyCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="text-sm">Annual Total:</span>
                      <span className="text-lg font-semibold">
                        ${(totalMonthlyCost * 12).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <button className="w-full bg-aws-orange text-white py-2 px-4 rounded-md hover:bg-orange-600 transition font-medium">
                      Save Estimate
                    </button>
                    <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition font-medium">
                      Share Estimate
                    </button>
                    <button className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 transition font-medium">
                      Export JSON
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No services selected yet.
                  <p className="text-sm mt-2">Add services to see cost estimates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
