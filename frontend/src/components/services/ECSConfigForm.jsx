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
  Alert,
  Slider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import {
  ECS_LAUNCH_TYPES,
  ECS_REGIONS,
  FARGATE_CPU_OPTIONS,
  FARGATE_STORAGE,
  ECS_OS_OPTIONS,
  ECS_ARCHITECTURE,
  calculateECSCost,
  getMemoryOptionsForCPU,
  getCostPerTaskPerHour,
} from '../../data/ecsData';

const ECSConfigForm = ({ onRemove, onCostUpdate }) => {
  // State for configuration
  const [config, setConfig] = useState({
    region: 'us-east-1',
    launchType: 'fargate',
    cpu: 1,
    memory: 2,
    numberOfTasks: 2,
    hoursPerMonth: 730, // 24/7
    operatingSystem: 'linux',
    architecture: 'x86_64',
    useFargateSpot: false,
    ephemeralStorage: 20, // GB (default free tier)
    dataTransferOut: 10, // GB
  });

  // State for cost calculation
  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: {} });

  // Get available memory options based on selected CPU
  const availableMemoryOptions = getMemoryOptionsForCPU(config.cpu);

  // Calculate cost whenever configuration changes
  useEffect(() => {
    const calculatedCost = calculateECSCost(config);
    setCost(calculatedCost);

    // Notify parent component of cost update
    if (onCostUpdate) {
      onCostUpdate({
        serviceCode: 'AmazonECS',
        serviceName: 'ECS (Elastic Container Service)',
        region: config.region,
        configuration: config,
        monthlyCost: calculatedCost.monthlyCost,
      });
    }
  }, [config, onCostUpdate]);

  // Handle configuration field changes
  const handleConfigChange = (field, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [field]: value };

      // Reset memory if CPU changes and current memory is not available
      if (field === 'cpu') {
        const newMemoryOptions = getMemoryOptionsForCPU(value);
        const memoryAvailable = newMemoryOptions.some((m) => m.value === prev.memory);
        if (!memoryAvailable && newMemoryOptions.length > 0) {
          newConfig.memory = newMemoryOptions[0].value;
        }
      }

      return newConfig;
    });
  };

  // Calculate cost per task per hour
  const costPerTaskPerHour = getCostPerTaskPerHour(
    config.cpu,
    config.memory,
    config.operatingSystem,
    config.architecture
  );

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            ECS Configuration
          </Typography>
          <Chip label="Containers" color="info" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove} aria-label="Remove service">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Launch Type Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Launch Type & Region</Typography>
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
                  {ECS_REGIONS.map((region) => (
                    <MenuItem key={region.code} value={region.code}>
                      {region.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Launch Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Launch Type</InputLabel>
                <Select
                  value={config.launchType}
                  label="Launch Type"
                  onChange={(e) => handleConfigChange('launchType', e.target.value)}
                >
                  {ECS_LAUNCH_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box>
                        <Typography variant="body2">
                          {type.icon} {type.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* EC2 Launch Type Info */}
            {config.launchType === 'ec2' && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <strong>EC2 Launch Type:</strong> ECS on EC2 doesn't have additional charges
                  beyond your EC2 instances. Add EC2 instances to calculate the cost of your
                  container hosts.
                </Alert>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Fargate Configuration (only show for Fargate launch type) */}
      {config.launchType === 'fargate' && (
        <>
          {/* Task Configuration Section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Task Configuration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* CPU */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>vCPU</InputLabel>
                    <Select
                      value={config.cpu}
                      label="vCPU"
                      onChange={(e) => handleConfigChange('cpu', e.target.value)}
                    >
                      {FARGATE_CPU_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography variant="body2">{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${option.pricePerHour}/vCPU/hour
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Memory */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Memory</InputLabel>
                    <Select
                      value={config.memory}
                      label="Memory"
                      onChange={(e) => handleConfigChange('memory', e.target.value)}
                    >
                      {availableMemoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography variant="body2">{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${option.pricePerHour}/GB/hour
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Task Configuration Summary */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'info.light',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Task Configuration Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>CPU:</strong> {config.cpu} vCPU | <strong>Memory:</strong>{' '}
                      {config.memory} GB
                    </Typography>
                    <Typography variant="body2" color="info.dark" sx={{ mt: 1 }}>
                      <strong>Cost per task per hour:</strong> ${costPerTaskPerHour}
                    </Typography>
                  </Box>
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
                      {ECS_OS_OPTIONS.map((os) => (
                        <MenuItem key={os.value} value={os.value}>
                          <Box>
                            <Typography variant="body2">{os.label}</Typography>
                            {os.multiplier > 1 && (
                              <Typography variant="caption" color="text.secondary">
                                {os.multiplier}x pricing
                              </Typography>
                            )}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Architecture */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Architecture</InputLabel>
                    <Select
                      value={config.architecture}
                      label="Architecture"
                      onChange={(e) => handleConfigChange('architecture', e.target.value)}
                    >
                      {ECS_ARCHITECTURE.map((arch) => (
                        <MenuItem key={arch.value} value={arch.value}>
                          <Box>
                            <Typography variant="body2">{arch.label}</Typography>
                            {arch.multiplier < 1 && (
                              <Typography variant="caption" color="success.main">
                                {Math.round((1 - arch.multiplier) * 100)}% cheaper
                              </Typography>
                            )}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Fargate Spot */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.useFargateSpot}
                        onChange={(e) =>
                          handleConfigChange('useFargateSpot', e.target.checked)
                        }
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Use Fargate Spot</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Save up to 70% with Fargate Spot for fault-tolerant workloads
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Scale Configuration Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Scale & Usage</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* Number of Tasks */}
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Number of Tasks: {config.numberOfTasks}
                  </Typography>
                  <Slider
                    value={config.numberOfTasks}
                    onChange={(e, value) => handleConfigChange('numberOfTasks', value)}
                    min={1}
                    max={100}
                    step={1}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                      { value: 100, label: '100' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>

                {/* Usage Hours */}
                <Grid item xs={12} md={6}>
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
                      { value: 182, label: '182h' },
                      { value: 365, label: '365h' },
                      { value: 730, label: '730h' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>

                {/* Usage Summary */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total task-hours per month:</strong>{' '}
                      {config.numberOfTasks * config.hoursPerMonth} task-hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Average utilization:</strong>{' '}
                      {((config.hoursPerMonth / 730) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Storage & Data Transfer Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Storage & Data Transfer</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* Ephemeral Storage */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ephemeral Storage (GB)"
                    type="number"
                    value={config.ephemeralStorage}
                    onChange={(e) =>
                      handleConfigChange('ephemeralStorage', parseFloat(e.target.value) || 20)
                    }
                    helperText={`20 GB included free, max ${FARGATE_STORAGE.maxStorage} GB`}
                    InputProps={{
                      inputProps: {
                        min: 20,
                        max: FARGATE_STORAGE.maxStorage,
                        step: 1,
                      },
                    }}
                  />
                </Grid>

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
                    helperText="Data transfer out to the internet"
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                  />
                </Grid>

                {/* Storage Info */}
                <Grid item xs={12}>
                  <Alert severity="info">
                    Each Fargate task includes {FARGATE_STORAGE.freeStorage} GB of ephemeral
                    storage at no additional cost. Additional storage costs $
                    {(FARGATE_STORAGE.additionalStoragePrice * 730).toFixed(3)}/GB/month.
                  </Alert>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </>
      )}

      {/* Cost Summary */}
      <Box mt={3} p={3} sx={{ bgcolor: 'info.light', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="info.dark">
          Estimated Monthly Cost
        </Typography>
        <Typography variant="h3" fontWeight="bold" color="info.main" gutterBottom>
          ${cost.monthlyCost.toFixed(2)}
        </Typography>

        {cost.breakdown && config.launchType === 'fargate' && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Cost Breakdown:
            </Typography>
            <Grid container spacing={1}>
              {cost.breakdown.computeCost !== undefined && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Compute (CPU + Memory):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.computeCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.storageCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Additional Storage:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.storageCost?.toFixed(2)}
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
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Cost per task per hour: ${cost.breakdown.hourlyRate}
                  </Typography>
                </Grid>
              )}

              {config.useFargateSpot && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                    * Includes Fargate Spot 70% discount
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {config.launchType === 'ec2' && cost.breakdown.note && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {cost.breakdown.note}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default ECSConfigForm;
