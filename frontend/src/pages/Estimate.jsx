import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { fetchEstimates, deleteEstimate } from '../store/slices/estimatesSlice';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';

function Estimate() {
  const dispatch = useDispatch();
<<<<<<< HEAD
  const { list, isLoading, error } = useSelector((state) => state.estimates);
=======
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { list, isLoading } = useSelector((state) => state.estimates);
>>>>>>> b8e17bb (Auto-commit: Agent tool execution)

  // View dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [estimateToDelete, setEstimateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Handle View
  const handleView = (estimate) => {
    setSelectedEstimate(estimate);
    setViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setSelectedEstimate(null);
  };

  // Handle Edit
  const handleEdit = (estimate) => {
    // Navigate to calculator with estimate data in state
    navigate('/calculator', { state: { estimate } });
  };

  // Handle Delete
  const handleDeleteClick = (estimate) => {
    setEstimateToDelete(estimate);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!estimateToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      await dispatch(deleteEstimate(estimateToDelete._id)).unwrap();
      enqueueSnackbar('Estimate deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setEstimateToDelete(null);
    } catch (error) {
      console.error('Delete estimate error:', error);
      enqueueSnackbar(error || 'Failed to delete estimate', { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEstimateToDelete(null);
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
                  <button
                    onClick={() => handleView(estimate)}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 transition text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(estimate)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-300 transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(estimate)}
                    className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition text-sm font-medium"
                  >
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

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseView}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {selectedEstimate?.name}
          </Typography>
          {selectedEstimate?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedEstimate.description}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Cost Summary */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Cost Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="text.secondary">
                  Monthly Cost:
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ${selectedEstimate?.totalMonthlyCost.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" color="text.secondary">
                  Annual Cost:
                </Typography>
                <Typography variant="h6" color="text.primary" fontWeight="bold">
                  ${selectedEstimate?.totalAnnualCost.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Services */}
            <Typography variant="h6" gutterBottom>
              Services ({selectedEstimate?.services.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedEstimate?.services.map((service, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {service.serviceName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={service.serviceCode}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={service.region}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${service.monthlyCost.toFixed(2)}/mo
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Metadata */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Created: {selectedEstimate?.createdAt && formatDate(selectedEstimate.createdAt)}
              </Typography>
              {selectedEstimate?.updatedAt && selectedEstimate.updatedAt !== selectedEstimate.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Updated: {formatDate(selectedEstimate.updatedAt)}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleCloseView();
              handleEdit(selectedEstimate);
            }}
          >
            Edit Estimate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Delete Estimate?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to delete "{estimateToDelete?.name}"? This action cannot be undone.
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'error.50', borderRadius: 1, border: '1px solid', borderColor: 'error.200' }}>
            <Typography variant="body2" color="error.dark">
              This will permanently delete this estimate and all its configuration data.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Estimate;
