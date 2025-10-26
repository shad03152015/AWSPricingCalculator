import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Calculate as CalculatorIcon,
  Description as DocumentIcon,
  Person as UserIcon,
  BarChart as ChartBarIcon
} from '@mui/icons-material';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      name: 'New Calculation',
      description: 'Configure and calculate AWS service costs',
      icon: CalculatorIcon,
      link: '/calculator',
      color: 'bg-blue-500',
    },
    {
      name: 'My Estimates',
      description: 'View and manage your saved cost estimates',
      icon: DocumentIcon,
      link: '/estimates',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-aws-squid-ink to-aws-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-xl text-gray-300">
              AWS Pricing Calculator - Estimate your cloud costs with confidence
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.name}
              to={feature.link}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`${feature.color} p-3 rounded-lg mr-4 flex items-center justify-center`}>
                    <feature.icon sx={{ fontSize: 24, color: 'white' }} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-aws-orange transition-colors">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 group-hover:bg-aws-orange group-hover:text-white transition-colors">
                <span className="text-sm font-medium">
                  Get started →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <ChartBarIcon sx={{ fontSize: 24 }} className="text-aws-orange mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Real-time Pricing</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Access up-to-date AWS pricing data directly from the AWS Pricing API
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <DocumentIcon sx={{ fontSize: 24 }} className="text-aws-orange mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Save & Share</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Save your estimates and share them with your team via secure links
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <UserIcon sx={{ fontSize: 24 }} className="text-aws-orange mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Your Account</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Email: <span className="font-medium">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-12 bg-gradient-to-r from-aws-orange to-orange-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <p className="text-lg mb-6">
            Ready to calculate your AWS costs? Start by selecting a service and configuring your requirements.
          </p>
          <Link
            to="/calculator"
            className="inline-block bg-white text-aws-orange font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Calculating
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
