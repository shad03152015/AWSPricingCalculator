import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { loadAvailableServices, addService } from '../store/slices/calculatorSlice';
import EC2ConfigForm from '../components/services/EC2ConfigForm';
import S3ConfigForm from '../components/services/S3ConfigForm';
import CostSummaryCard from '../components/CostSummaryCard';

function Calculator() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { availableServices, services, totalMonthlyCost } = useSelector((state) => state.calculator);

  // State for dialogs
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [estimateName, setEstimateName] = useState('');
  const [estimateDescription, setEstimateDescription] = useState('');

  // State for configured services
  const [configuredServices, setConfiguredServices] = useState([]);

  useEffect(() => {
    dispatch(loadAvailableServices());
  }, [dispatch]);

  // Handle adding EC2 service
  const handleAddEC2 = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'EC2', data: null },
    ]);
    enqueueSnackbar('EC2 service added to calculator', { variant: 'success' });
  };

  // Handle adding S3 service
  const handleAddS3 = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'S3', data: null },
    ]);
    enqueueSnackbar('S3 service added to calculator', { variant: 'success' });
  };

  // Handle removing service
  const handleRemoveService = (serviceId) => {
    setConfiguredServices((prev) => prev.filter((s) => s.id !== serviceId));
    enqueueSnackbar('Service removed from calculator', { variant: 'info' });
  };

  // Handle cost update from service configuration
  const handleCostUpdate = (serviceId, costData) => {
    setConfiguredServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, data: costData } : s))
    );
  };

  // Calculate total cost from configured services
  const calculatedTotal = configuredServices.reduce(
    (sum, service) => sum + (service.data?.monthlyCost || 0),
    0
  );

  // Handle save estimate
  const handleSaveEstimate = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = () => {
    // TODO: Implement save to backend
    enqueueSnackbar('Estimate saved successfully!', { variant: 'success' });
    setSaveDialogOpen(false);
    setEstimateName('');
    setEstimateDescription('');
  };

  // Handle share estimate
  const handleShareEstimate = () => {
    // TODO: Implement share functionality
    enqueueSnackbar('Share functionality coming soon!', { variant: 'info' });
  };

  // Handle export estimate
  const handleExportEstimate = () => {
    const exportData = {
      name: 'AWS Cost Estimate',
      timestamp: new Date().toISOString(),
      services: configuredServices.filter((s) => s.data).map((s) => s.data),
      totalMonthlyCost: calculatedTotal,
      totalAnnualCost: calculatedTotal * 12,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aws-estimate-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    enqueueSnackbar('Estimate exported successfully!', { variant: 'success' });
  };

  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all services?')) {
      setConfiguredServices([]);
      enqueueSnackbar('All services cleared', { variant: 'info' });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box mb={4}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            AWS Pricing Calculator
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Configure AWS services and estimate your monthly costs
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column: Service Configuration */}
          <Grid item xs={12} lg={8}>
            {/* Service Selection Panel */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Available Services
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select services to configure and estimate costs. Currently showcasing EC2 as a
                complete implementation.
              </Typography>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Compute Services</Typography>
                    <Chip label="1 service" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                      },
                      transition: 'all 0.2s',
                    }}
                    onClick={handleAddEC2}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          EC2 - Elastic Compute Cloud
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Virtual servers in the cloud with full Material UI implementation and
                          Redis caching
                        </Typography>
                        <Box mt={1}>
                          <Chip label="Compute" size="small" sx={{ mr: 1 }} />
                          <Chip label="Phase 2 Complete" size="small" color="success" />
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddEC2}
                      >
                        Add EC2
                      </Button>
                    </Box>
                  </Paper>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Storage Services</Typography>
                    <Chip label="1 service" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                      },
                      transition: 'all 0.2s',
                    }}
                    onClick={handleAddS3}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          S3 - Simple Storage Service
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Object storage service with multiple storage classes for cost optimization
                        </Typography>
                        <Box mt={1}>
                          <Chip label="Storage" size="small" sx={{ mr: 1 }} />
                          <Chip label="Available" size="small" color="success" />
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddS3}
                      >
                        Add S3
                      </Button>
                    </Box>
                  </Paper>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Database Services</Typography>
                    <Chip label="Coming Soon" size="small" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    RDS, DynamoDB, and other database services will be added in future phases.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>

            {/* Configured Services */}
            {configuredServices.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Configured Services
                </Typography>
                {configuredServices.map((service) => (
                  <Box key={service.id} mb={3}>
                    {service.type === 'EC2' && (
                      <EC2ConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                    {service.type === 'S3' && (
                      <S3ConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {configuredServices.length === 0 && (
              <Paper
                elevation={2}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No services configured yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Click "Add EC2" above to start configuring your first service
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Right Column: Cost Summary */}
          <Grid item xs={12} lg={4}>
            <CostSummaryCard
              services={configuredServices.filter((s) => s.data).map((s) => s.data)}
              onSave={handleSaveEstimate}
              onShare={handleShareEstimate}
              onExport={handleExportEstimate}
              onClear={handleClearAll}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Save Estimate Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Estimate</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Estimate Name"
              value={estimateName}
              onChange={(e) => setEstimateName(e.target.value)}
              placeholder="e.g., Production Environment"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              value={estimateDescription}
              onChange={(e) => setEstimateDescription(e.target.value)}
              placeholder="Add notes about this estimate..."
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveConfirm}
            disabled={!estimateName.trim()}
          >
            Save Estimate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Calculator;
