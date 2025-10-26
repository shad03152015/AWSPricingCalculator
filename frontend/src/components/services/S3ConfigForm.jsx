import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Grid,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import {
  S3_STORAGE_CLASSES,
  S3_REGIONS,
  calculateS3Cost,
  getStorageClassDetails,
} from '../../data/s3Data';

const S3ConfigForm = ({ onRemove, onCostUpdate }) => {
  // State for configuration
  const [config, setConfig] = useState({
    region: 'us-east-1',
    storageClass: 'STANDARD',
    storageAmount: 100, // GB
    putRequests: 10000, // per month
    getRequests: 100000, // per month
    dataTransferOut: 10, // GB per month
    dataRetrieved: 0, // GB per month (for IA/Glacier)
    enableReplication: false,
    replicationAmount: 0,
    numberOfObjects: 10000, // for Intelligent-Tiering
  });

  // State for cost calculation
  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: {} });

  // Calculate cost whenever configuration changes
  useEffect(() => {
    const calculatedCost = calculateS3Cost(config);
    setCost(calculatedCost);

    // Notify parent component of cost update
    if (onCostUpdate) {
      onCostUpdate({
        serviceCode: 'AmazonS3',
        serviceName: 'S3 (Simple Storage Service)',
        region: config.region,
        configuration: config,
        monthlyCost: calculatedCost.monthlyCost,
      });
    }
  }, [config, onCostUpdate]);

  // Handle configuration field changes
  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Get selected storage class details
  const selectedStorageClass = getStorageClassDetails(config.storageClass);

  // Calculate estimated cost per TB for display
  const costPerTB = selectedStorageClass
    ? (selectedStorageClass.pricePerGB * 1024).toFixed(2)
    : '0.00';

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            S3 Configuration
          </Typography>
          <Chip label="Storage" color="success" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove} aria-label="Remove service">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Storage Configuration Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Storage Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Region */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={config.region}
                  label="Region"
                  onChange={(e) => handleConfigChange('region', e.target.value)}
                >
                  {S3_REGIONS.map((region) => (
                    <MenuItem key={region.code} value={region.code}>
                      {region.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Storage Class */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Storage Class</InputLabel>
                <Select
                  value={config.storageClass}
                  label="Storage Class"
                  onChange={(e) => handleConfigChange('storageClass', e.target.value)}
                >
                  {S3_STORAGE_CLASSES.map((sc) => (
                    <MenuItem key={sc.value} value={sc.value}>
                      <Box>
                        <Typography variant="body2">{sc.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ${sc.pricePerGB}/GB/month
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Storage Class Info */}
            {selectedStorageClass && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {selectedStorageClass.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedStorageClass.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Durability
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedStorageClass.durability}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Availability
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedStorageClass.availability}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Cost per TB
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        ${costPerTB}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Min Storage
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedStorageClass.minimumStorageDays} days
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}

            {/* Storage Amount */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Storage Amount (GB)"
                type="number"
                value={config.storageAmount}
                onChange={(e) =>
                  handleConfigChange('storageAmount', parseFloat(e.target.value) || 0)
                }
                helperText={`${(config.storageAmount / 1024).toFixed(2)} TB`}
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>

            {/* Number of Objects (for Intelligent-Tiering) */}
            {config.storageClass === 'INTELLIGENT_TIERING' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Objects"
                  type="number"
                  value={config.numberOfObjects}
                  onChange={(e) =>
                    handleConfigChange('numberOfObjects', parseInt(e.target.value) || 0)
                  }
                  helperText="For monitoring fee calculation"
                  InputProps={{ inputProps: { min: 0, step: 1000 } }}
                />
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Request Configuration Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">API Requests</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure the estimated number of API requests per month
              </Typography>
            </Grid>

            {/* PUT Requests */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  label="PUT Requests (per month)"
                  type="number"
                  value={config.putRequests}
                  onChange={(e) =>
                    handleConfigChange('putRequests', parseInt(e.target.value) || 0)
                  }
                  helperText={`${(config.putRequests / 1000).toFixed(1)}K requests`}
                  InputProps={{ inputProps: { min: 0, step: 1000 } }}
                />
                <Tooltip title="PUT, COPY, POST, and LIST requests">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </Box>
            </Grid>

            {/* GET Requests */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  label="GET Requests (per month)"
                  type="number"
                  value={config.getRequests}
                  onChange={(e) =>
                    handleConfigChange('getRequests', parseInt(e.target.value) || 0)
                  }
                  helperText={`${(config.getRequests / 1000).toFixed(1)}K requests`}
                  InputProps={{ inputProps: { min: 0, step: 1000 } }}
                />
                <Tooltip title="GET, SELECT, and other requests">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </Box>
            </Grid>

            {/* Request Pricing Info */}
            {selectedStorageClass && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'info.light',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption" color="info.dark">
                    <strong>Request Pricing:</strong> PUT: $
                    {(selectedStorageClass.requestPricing.put * 1000).toFixed(4)} per 1K
                    requests, GET: $
                    {(selectedStorageClass.requestPricing.get * 1000).toFixed(4)} per 1K
                    requests
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Data Transfer & Retrieval Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Data Transfer & Retrieval</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Data Transfer Out */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data Transfer Out (GB/month)"
                type="number"
                value={config.dataTransferOut}
                onChange={(e) =>
                  handleConfigChange('dataTransferOut', parseFloat(e.target.value) || 0)
                }
                helperText="Data transfer out to the internet (first 1 GB/month is free)"
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>

            {/* Data Retrieved (for IA/Glacier classes) */}
            {selectedStorageClass?.retrievalFee > 0 && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data Retrieved (GB/month)"
                  type="number"
                  value={config.dataRetrieved}
                  onChange={(e) =>
                    handleConfigChange('dataRetrieved', parseFloat(e.target.value) || 0)
                  }
                  helperText={`Retrieval fee: $${selectedStorageClass.retrievalFee}/GB`}
                  InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
              </Grid>
            )}

            {/* Glacier Retrieval Options Info */}
            {selectedStorageClass?.retrievalOptions && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'warning.light',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Retrieval Options:
                  </Typography>
                  <Typography variant="caption" display="block">
                    {Object.entries(selectedStorageClass.retrievalOptions).map(
                      ([key, value]) => (
                        <Box key={key} component="span" sx={{ display: 'block', my: 0.5 }}>
                          <strong>{key}:</strong> ${value.pricePerGB}/GB -{' '}
                          {value.minutes || value.hours}
                          {value.minutes ? ' minutes' : ' hours'}
                        </Box>
                      )
                    )}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Additional Features Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Additional Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Replication */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.enableReplication}
                    onChange={(e) =>
                      handleConfigChange('enableReplication', e.target.checked)
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">Enable S3 Replication</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Cross-region or same-region replication
                    </Typography>
                  </Box>
                }
              />
            </Grid>

            {config.enableReplication && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Replication Amount (GB/month)"
                  type="number"
                  value={config.replicationAmount}
                  onChange={(e) =>
                    handleConfigChange('replicationAmount', parseFloat(e.target.value) || 0)
                  }
                  helperText="Amount of data replicated per month"
                  InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Cost Summary */}
      <Box mt={3} p={3} sx={{ bgcolor: 'success.light', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="success.dark">
          Estimated Monthly Cost
        </Typography>
        <Typography variant="h3" fontWeight="bold" color="success.main" gutterBottom>
          ${cost.monthlyCost.toFixed(2)}
        </Typography>

        {cost.breakdown && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Cost Breakdown:
            </Typography>
            <Grid container spacing={1}>
              {cost.breakdown.storageCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Storage Cost:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.storageCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.monitoringCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Monitoring (Intelligent-Tiering):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.monitoringCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.requestCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">API Requests:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.requestCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.retrievalCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Data Retrieval:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.retrievalCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.transferCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Data Transfer:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.transferCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.replicationCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Replication:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.replicationCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  Annual Cost:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold" align="right">
                  ${(cost.monthlyCost * 12).toFixed(2)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Cost per GB stored: ${(cost.monthlyCost / config.storageAmount).toFixed(4)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default S3ConfigForm;
