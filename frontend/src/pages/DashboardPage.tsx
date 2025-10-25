import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import api from '../utils/api';
import { Estimate } from '../types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEstimateName, setNewEstimateName] = useState('');
  const [newEstimateDescription, setNewEstimateDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/estimates');
      setEstimates(response.data.data.estimates);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch estimates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEstimate = async () => {
    if (!newEstimateName.trim()) return;

    try {
      setIsCreating(true);
      const response = await api.post('/estimates', {
        name: newEstimateName,
        description: newEstimateDescription,
        services: [],
      });

      const newEstimate = response.data.data.estimate;
      navigate(`/estimate/${newEstimate._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create estimate');
    } finally {
      setIsCreating(false);
      setCreateDialogOpen(false);
      setNewEstimateName('');
      setNewEstimateDescription('');
    }
  };

  const handleDeleteEstimate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this estimate?')) return;

    try {
      await api.delete(`/estimates/${id}`);
      setEstimates(estimates.filter((e) => e._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete estimate');
    }
  };

  const handleDuplicateEstimate = async (id: string) => {
    try {
      const response = await api.post(`/estimates/${id}/duplicate`);
      const duplicatedEstimate = response.data.data.estimate;
      setEstimates([duplicatedEstimate, ...estimates]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to duplicate estimate');
    }
  };

  const handleShareEstimate = async (id: string) => {
    try {
      const response = await api.post(`/estimates/${id}/share`);
      const shareUrl = response.data.data.shareUrl;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert(`Share link copied to clipboard!\n\n${shareUrl}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate share link');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Estimates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Estimate
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {estimates.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No estimates yet
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create your first estimate to get started with AWS cost calculations
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Estimate
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {estimates.map((estimate) => (
            <Grid item xs={12} md={6} lg={4} key={estimate._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {estimate.name}
                  </Typography>
                  {estimate.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {estimate.description}
                    </Typography>
                  )}
                  <Box mt={2}>
                    <Typography variant="h4" color="primary">
                      {formatCurrency(estimate.totalMonthlyCost)}
                      <Typography component="span" variant="body2" color="text.secondary">
                        /month
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(estimate.totalAnnualCost)}/year
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Chip
                      label={`${estimate.services.length} service${estimate.services.length !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Updated {formatDate(estimate.updatedAt)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/estimate/${estimate._id}`)}
                  >
                    Edit
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleDuplicateEstimate(estimate._id)}
                    title="Duplicate"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleShareEstimate(estimate._id)}
                    title="Share"
                  >
                    <ShareIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteEstimate(estimate._id)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Estimate Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Estimate</DialogTitle>
        <DialogContent>
          <TextField
            label="Estimate Name"
            fullWidth
            margin="normal"
            value={newEstimateName}
            onChange={(e) => setNewEstimateName(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Description (optional)"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newEstimateDescription}
            onChange={(e) => setNewEstimateDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateEstimate}
            variant="contained"
            disabled={!newEstimateName.trim() || isCreating}
          >
            {isCreating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
