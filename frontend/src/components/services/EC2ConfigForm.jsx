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
  Slider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InfoIcon from '@mui/icons-material/Info';
import {
  EC2_FAMILIES,
  OPERATING_SYSTEMS,
  PRICING_MODELS,
  EBS_VOLUME_TYPES,
  TENANCY_OPTIONS,
  getAllInstanceTypes,
  calculateEC2Cost,
} from '../../data/ec2Data';

const AWS_REGIONS = [
  { code: 'us-east-1', name: 'US East (N. Virginia)' },
  { code: 'us-east-2', name: 'US East (Ohio)' },
  { code: 'us-west-1', name: 'US West (N. California)' },
  { code: 'us-west-2', name: 'US West (Oregon)' },
  { code: 'ca-central-1', name: 'Canada (Central)' },
  { code: 'eu-west-1', name: 'EU (Ireland)' },
  { code: 'eu-west-2', name: 'EU (London)' },
  { code: 'eu-west-3', name: 'EU (Paris)' },
  { code: 'eu-central-1', name: 'EU (Frankfurt)' },
  { code: 'eu-north-1', name: 'EU (Stockholm)' },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
  { code: 'sa-east-1', name: 'South America (São Paulo)' },
];

const EC2ConfigForm = ({ onRemove, onCostUpdate }) => {
  const instanceTypes = getAllInstanceTypes();

  // State for configuration
  const [config, setConfig] = useState({
    region: 'us-east-1',
    instanceType: null,
    operatingSystem: 'Linux',
    quantity: 1,
    hoursPerMonth: 730, // 24/7 operation
    pricingModel: 'On-Demand',
    tenancy: 'Shared',
    ebsVolumes: [],
    dataTransferOut: 0,
  });

  // State for EBS volume being added
  const [newVolume, setNewVolume] = useState({
    type: 'gp3',
    size: 100,
    iops: null,
  });

  // State for cost calculation
  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: {} });

  // Calculate cost whenever configuration changes
  useEffect(() => {
    if (config.instanceType) {
      const calculatedCost = calculateEC2Cost(config);
      setCost(calculatedCost);

      // Notify parent component of cost update
      if (onCostUpdate) {
        onCostUpdate({
          serviceCode: 'AmazonEC2',
          serviceName: 'EC2 (Elastic Compute Cloud)',
          region: config.region,
          configuration: config,
          monthlyCost: calculatedCost.monthlyCost,
        });
      }
    }
  }, [config, onCostUpdate]);

  // Handle configuration field changes
  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Handle instance type selection
  const handleInstanceTypeChange = (event, value) => {
    setConfig((prev) => ({ ...prev, instanceType: value ? value.type : null }));
  };

  // Add EBS volume
  const handleAddVolume = () => {
    if (newVolume.size > 0) {
      setConfig((prev) => ({
        ...prev,
        ebsVolumes: [...prev.ebsVolumes, { ...newVolume, id: Date.now() }],
      }));
      // Reset new volume form
      setNewVolume({ type: 'gp3', size: 100, iops: null });
    }
  };

  // Remove EBS volume
  const handleRemoveVolume = (volumeId) => {
    setConfig((prev) => ({
      ...prev,
      ebsVolumes: prev.ebsVolumes.filter((v) => v.id !== volumeId),
    }));
  };

  // Get selected instance details
  const selectedInstance = config.instanceType
    ? instanceTypes.find((i) => i.type === config.instanceType)
    : null;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            EC2 Configuration
          </Typography>
          <Chip label="Compute" color="primary" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove} aria-label="Remove service">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Instance Details Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Instance Details</Typography>
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
                  {AWS_REGIONS.map((region) => (
                    <MenuItem key={region.code} value={region.code}>
                      {region.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Instance Type */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={instanceTypes}
                groupBy={(option) => option.family}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {option.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.vcpu} vCPU, {option.memory} GB RAM
                        {option.arch ? ` (${option.arch})` : ''}
                        {option.gpu ? ` - ${option.gpu} GPU` : ''}
                      </Typography>
                    </Box>
                  </Box>
                )}
                onChange={handleInstanceTypeChange}
                renderInput={(params) => (
                  <TextField {...params} label="Instance Type" required />
                )}
              />
            </Grid>

            {/* Operating System */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Operating System</InputLabel>
                <Select
                  value={config.operatingSystem}
                  label="Operating System"
                  onChange={(e) => handleConfigChange('operatingSystem', e.target.value)}
                >
                  {OPERATING_SYSTEMS.map((os) => (
                    <MenuItem key={os.value} value={os.value}>
                      {os.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Pricing Model */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pricing Model</InputLabel>
                <Select
                  value={config.pricingModel}
                  label="Pricing Model"
                  onChange={(e) => handleConfigChange('pricingModel', e.target.value)}
                >
                  {PRICING_MODELS.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      <Box>
                        <Typography variant="body2">{model.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {model.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Tenancy */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tenancy</InputLabel>
                <Select
                  value={config.tenancy}
                  label="Tenancy"
                  onChange={(e) => handleConfigChange('tenancy', e.target.value)}
                >
                  {TENANCY_OPTIONS.map((option) => (
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

            {/* Quantity Slider */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                Number of Instances: {config.quantity}
              </Typography>
              <Slider
                value={config.quantity}
                onChange={(e, value) => handleConfigChange('quantity', value)}
                min={1}
                max={20}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Usage Hours Slider */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography>
                  Usage Hours per Month: {config.hoursPerMonth}
                </Typography>
                <Tooltip title="730 hours = 24/7 operation">
                  <InfoIcon fontSize="small" color="action" />
                </Tooltip>
              </Box>
              <Slider
                value={config.hoursPerMonth}
                onChange={(e, value) => handleConfigChange('hoursPerMonth', value)}
                min={1}
                max={730}
                step={1}
                marks={[
                  { value: 1, label: '1h' },
                  { value: 182, label: '182h (25%)' },
                  { value: 365, label: '365h (50%)' },
                  { value: 730, label: '730h (24/7)' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Instance Summary */}
            {selectedInstance && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Instance Details:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong> {selectedInstance.type} |{' '}
                    <strong>vCPU:</strong> {selectedInstance.vcpu} |{' '}
                    <strong>Memory:</strong> {selectedInstance.memory} GB
                    {selectedInstance.storage && (
                      <> | <strong>Storage:</strong> {selectedInstance.storage} GB</>
                    )}
                    {selectedInstance.gpu && (
                      <> | <strong>GPU:</strong> {selectedInstance.gpu}</>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Base hourly rate: ${selectedInstance.hourlyPrice}/hour
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* EBS Storage Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">EBS Storage</Typography>
          {config.ebsVolumes.length > 0 && (
            <Chip
              label={`${config.ebsVolumes.length} volume${config.ebsVolumes.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Existing Volumes */}
            {config.ebsVolumes.map((volume, index) => (
              <Grid item xs={12} key={volume.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2">
                      <strong>Volume {index + 1}:</strong>{' '}
                      {EBS_VOLUME_TYPES.find((t) => t.value === volume.type)?.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {volume.size} GB
                      {volume.iops && ` | ${volume.iops} IOPS`}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveVolume(volume.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}

            {/* Add New Volume Form */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Add EBS Volume
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Volume Type</InputLabel>
                <Select
                  value={newVolume.type}
                  label="Volume Type"
                  onChange={(e) =>
                    setNewVolume((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  {EBS_VOLUME_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box>
                        <Typography variant="body2">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ${type.pricePerGB}/GB
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Size (GB)"
                type="number"
                value={newVolume.size}
                onChange={(e) =>
                  setNewVolume((prev) => ({ ...prev, size: parseInt(e.target.value) || 0 }))
                }
                InputProps={{ inputProps: { min: 1, max: 16384 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={handleAddVolume}
                sx={{ height: '56px' }}
              >
                Add Volume
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Data Transfer Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Data Transfer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data Transfer Out (GB/month)"
                type="number"
                value={config.dataTransferOut}
                onChange={(e) =>
                  handleConfigChange('dataTransferOut', parseFloat(e.target.value) || 0)
                }
                helperText="Data transfer out to the internet (first 1GB/month is free)"
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Cost Summary */}
      <Box mt={3} p={3} sx={{ bgcolor: 'primary.light', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="primary.dark">
          Estimated Monthly Cost
        </Typography>
        <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
          ${cost.monthlyCost.toFixed(2)}
        </Typography>

        {cost.breakdown && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Cost Breakdown:
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">Instance Cost:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">
                  ${cost.breakdown.instanceCost?.toFixed(2) || '0.00'}
                </Typography>
              </Grid>

              {cost.breakdown.ebsCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">EBS Storage:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.ebsCost?.toFixed(2)}
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

              {cost.breakdown.hourlyRate && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Effective hourly rate: ${cost.breakdown.hourlyRate}/hour
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default EC2ConfigForm;
