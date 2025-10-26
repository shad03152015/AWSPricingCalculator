import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Autocomplete,
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
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import {
  RDS_DATABASE_ENGINES,
  RDS_REGIONS,
  RDS_DEPLOYMENT_OPTIONS,
  RDS_STORAGE_TYPES,
  AURORA_STORAGE,
  getAllRDSInstanceTypes,
  getAuroraInstanceTypes,
  calculateRDSCost,
  getDatabaseEngineDetails,
  getStorageTypeDetails,
} from '../../data/rdsData';

const RDSConfigForm = ({ onRemove, onCostUpdate }) => {
  // State for configuration
  const [config, setConfig] = useState({
    region: 'us-east-1',
    engine: 'mysql',
    instanceType: null,
    deploymentOption: 'single-az',
    storageType: 'gp3',
    storageAmount: 100, // GB
    provisionedIOPS: 3000,
    backupStorageAmount: 0,
    isAuroraServerless: false,
    auroraACU: 2,
    auroraIORequests: 1000000, // 1 million I/O requests per month
  });

  // State for cost calculation
  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: {} });

  // Get engine details
  const selectedEngine = getDatabaseEngineDetails(config.engine);
  const isAurora = selectedEngine?.isAurora || false;

  // Get appropriate instance types based on engine
  const availableInstances = isAurora ? getAuroraInstanceTypes() : getAllRDSInstanceTypes();

  // Calculate cost whenever configuration changes
  useEffect(() => {
    if (config.instanceType || (isAurora && config.isAuroraServerless)) {
      const calculatedCost = calculateRDSCost(config);
      setCost(calculatedCost);

      // Notify parent component of cost update
      if (onCostUpdate) {
        onCostUpdate({
          serviceCode: 'AmazonRDS',
          serviceName: 'RDS (Relational Database Service)',
          region: config.region,
          configuration: config,
          monthlyCost: calculatedCost.monthlyCost,
        });
      }
    }
  }, [config, onCostUpdate, isAurora]);

  // Handle configuration field changes
  const handleConfigChange = (field, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [field]: value };

      // Reset instance type when changing engine
      if (field === 'engine') {
        newConfig.instanceType = null;
        newConfig.isAuroraServerless = false;
      }

      // Adjust storage type for Aurora
      if (field === 'engine') {
        const engineDetails = getDatabaseEngineDetails(value);
        if (engineDetails?.isAurora) {
          newConfig.storageType = 'aurora';
        } else if (newConfig.storageType === 'aurora') {
          newConfig.storageType = 'gp3';
        }
      }

      return newConfig;
    });
  };

  // Handle instance type selection
  const handleInstanceTypeChange = (event, value) => {
    setConfig((prev) => ({
      ...prev,
      instanceType: value ? value.type : null,
    }));
  };

  // Get selected storage type details
  const selectedStorage = getStorageTypeDetails(config.storageType);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            RDS Configuration
          </Typography>
          <Chip label="Database" color="secondary" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove} aria-label="Remove service">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Database Configuration Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Database Configuration</Typography>
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
                  {RDS_REGIONS.map((region) => (
                    <MenuItem key={region.code} value={region.code}>
                      {region.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Database Engine */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Database Engine</InputLabel>
                <Select
                  value={config.engine}
                  label="Database Engine"
                  onChange={(e) => handleConfigChange('engine', e.target.value)}
                >
                  {RDS_DATABASE_ENGINES.map((engine) => (
                    <MenuItem key={engine.value} value={engine.value}>
                      <Box>
                        <Typography variant="body2">{engine.label}</Typography>
                        {engine.licenseCost > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            +${engine.licenseCost}/hour license
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Engine Info */}
            {selectedEngine && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: isAurora ? 'secondary.light' : 'action.hover',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {selectedEngine.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEngine.description}
                  </Typography>
                  {isAurora && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Aurora uses different storage and instance options than standard RDS
                    </Alert>
                  )}
                </Box>
              </Grid>
            )}

            {/* Aurora Serverless Toggle */}
            {isAurora && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.isAuroraServerless}
                      onChange={(e) =>
                        handleConfigChange('isAuroraServerless', e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">Use Aurora Serverless v2</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Auto-scaling database capacity
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            )}

            {/* Aurora Serverless ACU */}
            {isAurora && config.isAuroraServerless && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Average Aurora Capacity Units (ACU)"
                  type="number"
                  value={config.auroraACU}
                  onChange={(e) =>
                    handleConfigChange('auroraACU', parseFloat(e.target.value) || 0.5)
                  }
                  helperText="Average ACU usage (0.5 to 128)"
                  InputProps={{ inputProps: { min: 0.5, max: 128, step: 0.5 } }}
                />
              </Grid>
            )}

            {/* Instance Type (for non-serverless) */}
            {(!isAurora || !config.isAuroraServerless) && (
              <Grid item xs={12}>
                <Autocomplete
                  options={availableInstances.filter(i => i.type !== 'Aurora Serverless v2')}
                  groupBy={(option) => option.family}
                  getOptionLabel={(option) => option.label || option.type}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{
                        display: 'block !important',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1.5fr 2fr 1.5fr',
                          gap: 2,
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {option.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.vcpu} vCPU
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.memory} GB
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.networkPerf}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${option.hourlyPrice}/hour
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  onChange={handleInstanceTypeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Instance Type"
                      required
                      helperText="Select an instance type for your database"
                    />
                  )}
                />
                {/* Column Headers */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.5fr 2fr 1.5fr',
                    gap: 2,
                    mt: 1,
                    px: 2,
                    py: 1,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    Instance Type
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    vCPUs
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    Memory
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    Network
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    Hourly Cost
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Deployment Option */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Deployment Option</InputLabel>
                <Select
                  value={config.deploymentOption}
                  label="Deployment Option"
                  onChange={(e) => handleConfigChange('deploymentOption', e.target.value)}
                >
                  {RDS_DEPLOYMENT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body2">{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Storage Configuration Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Storage Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {isAurora ? (
              <>
                {/* Aurora Storage */}
                <Grid item xs={12}>
                  <Alert severity="info">
                    Aurora storage automatically scales from 10 GB to 128 TB. You only pay for
                    what you use at ${AURORA_STORAGE.pricePerGB}/GB-month.
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Estimated Storage Amount (GB)"
                    type="number"
                    value={config.storageAmount}
                    onChange={(e) =>
                      handleConfigChange('storageAmount', parseFloat(e.target.value) || 10)
                    }
                    helperText="Estimated average storage usage"
                    InputProps={{ inputProps: { min: 10, max: 128000, step: 10 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="I/O Requests per Month"
                    type="number"
                    value={config.auroraIORequests}
                    onChange={(e) =>
                      handleConfigChange(
                        'auroraIORequests',
                        parseInt(e.target.value) || 0
                      )
                    }
                    helperText={`${(config.auroraIORequests / 1000000).toFixed(1)}M requests @ $${AURORA_STORAGE.pricePerIORequest * 1000000}/million`}
                    InputProps={{ inputProps: { min: 0, step: 1000000 } }}
                  />
                </Grid>
              </>
            ) : (
              <>
                {/* Standard RDS Storage */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Storage Type</InputLabel>
                    <Select
                      value={config.storageType}
                      label="Storage Type"
                      onChange={(e) => handleConfigChange('storageType', e.target.value)}
                    >
                      {RDS_STORAGE_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box>
                            <Typography variant="body2">{type.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${type.pricePerGB}/GB-month
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Storage Amount (GB)"
                    type="number"
                    value={config.storageAmount}
                    onChange={(e) =>
                      handleConfigChange('storageAmount', parseFloat(e.target.value) || 20)
                    }
                    helperText={`Min: 20 GB, Max: 64 TB`}
                    InputProps={{ inputProps: { min: 20, max: 65536, step: 10 } }}
                  />
                </Grid>

                {/* Provisioned IOPS for gp3 and io1 */}
                {(config.storageType === 'gp3' || config.storageType === 'io1') && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Provisioned IOPS"
                      type="number"
                      value={config.provisionedIOPS}
                      onChange={(e) =>
                        handleConfigChange('provisionedIOPS', parseInt(e.target.value) || 0)
                      }
                      helperText={
                        config.storageType === 'gp3'
                          ? '3,000 IOPS included, additional IOPS cost extra'
                          : 'Min: 1,000 IOPS'
                      }
                      InputProps={{
                        inputProps: {
                          min: config.storageType === 'io1' ? 1000 : 3000,
                          max: 64000,
                          step: 1000,
                        },
                      }}
                    />
                  </Grid>
                )}

                {/* Storage Info */}
                {selectedStorage && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'info.light',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="info.dark">
                        <strong>{selectedStorage.label}:</strong>{' '}
                        {selectedStorage.description}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Backup & Additional Features Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Backup & Additional Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Free backup storage equal to provisioned database storage
                </Typography>
                <Tooltip title="Backup storage beyond your provisioned storage is charged at $0.095/GB-month">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Additional Backup Storage (GB)"
                type="number"
                value={config.backupStorageAmount}
                onChange={(e) =>
                  handleConfigChange(
                    'backupStorageAmount',
                    parseFloat(e.target.value) || 0
                  )
                }
                helperText="Backup storage beyond free tier ($0.095/GB-month)"
                InputProps={{ inputProps: { min: 0, step: 10 } }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Cost Summary */}
      <Box mt={3} p={3} sx={{ bgcolor: 'secondary.light', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="secondary.dark">
          Estimated Monthly Cost
        </Typography>
        <Typography variant="h3" fontWeight="bold" color="secondary.main" gutterBottom>
          ${cost.monthlyCost.toFixed(2)}
        </Typography>

        {cost.breakdown && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Cost Breakdown:
            </Typography>
            <Grid container spacing={1}>
              {cost.breakdown.instanceCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Database Instance:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.instanceCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.storageCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Storage {isAurora && '& I/O'}:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.storageCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.backupCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Additional Backup:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.backupCost?.toFixed(2)}
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

              {config.deploymentOption !== 'single-az' && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    * Multi-AZ deployment includes standby replica costs
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default RDSConfigForm;
