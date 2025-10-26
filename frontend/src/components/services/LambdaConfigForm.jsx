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
  Button,
  ButtonGroup,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import {
  LAMBDA_MEMORY_OPTIONS,
  LAMBDA_ARCHITECTURES,
  LAMBDA_REGIONS,
  LAMBDA_FREE_TIER,
  LAMBDA_EPHEMERAL_STORAGE,
  LAMBDA_USE_CASES,
  calculateLambdaCost,
  getMemoryOption,
  calculateGBSeconds,
  formatGBSeconds,
  getCostPerInvocation,
} from '../../data/lambdaData';

const LambdaConfigForm = ({ onRemove, onCostUpdate }) => {
  // State for configuration
  const [config, setConfig] = useState({
    region: 'us-east-1',
    architecture: 'x86_64',
    memory: 1024,
    avgDuration: 200, // milliseconds
    requestsPerMonth: 1000000,
    ephemeralStorage: 512, // MB
    useProvisionedConcurrency: false,
    provisionedConcurrency: 0,
    provisionedConcurrencyHours: 730,
    applyFreeTier: true,
  });

  // State for cost calculation
  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: {} });

  // Use ref to store the latest onCostUpdate callback to avoid infinite loops
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => {
    onCostUpdateRef.current = onCostUpdate;
  }, [onCostUpdate]);

  // Calculate cost whenever configuration changes
  useEffect(() => {
    const calculatedCost = calculateLambdaCost(config);
    setCost(calculatedCost);

    // Notify parent component of cost update
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AWSLambda',
        serviceName: 'Lambda (Serverless Functions)',
        region: config.region,
        configuration: config,
        monthlyCost: calculatedCost.monthlyCost,
      });
    }
  }, [config]);

  // Handle configuration field changes
  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Handle use case template selection
  const handleUseCaseTemplate = (useCase) => {
    setConfig((prev) => ({
      ...prev,
      memory: useCase.defaultConfig.memory,
      avgDuration: useCase.defaultConfig.avgDuration,
      requestsPerMonth: useCase.defaultConfig.requestsPerMonth,
    }));
  };

  // Calculate total GB-seconds
  const totalGBSeconds = calculateGBSeconds(
    config.memory,
    config.avgDuration,
    config.requestsPerMonth
  );

  // Get memory details
  const memoryOption = getMemoryOption(config.memory);

  // Calculate cost per invocation
  const costPerInvocation = getCostPerInvocation(
    config.memory,
    config.avgDuration,
    config.architecture,
    config.region
  );

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Lambda Configuration
          </Typography>
          <Chip label="Serverless" color="warning" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove} aria-label="Remove service">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Use Case Templates */}
      <Box mb={3}>
        <Typography variant="subtitle2" gutterBottom>
          Quick Start Templates:
        </Typography>
        <ButtonGroup variant="outlined" size="small" sx={{ flexWrap: 'wrap' }}>
          {LAMBDA_USE_CASES.map((useCase) => (
            <Button
              key={useCase.name}
              onClick={() => handleUseCaseTemplate(useCase)}
              sx={{ mb: 1 }}
            >
              {useCase.name}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Function Configuration Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Function Configuration</Typography>
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
                  {LAMBDA_REGIONS.map((region) => (
                    <MenuItem key={region.code} value={region.code}>
                      {region.name}
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
                  {LAMBDA_ARCHITECTURES.map((arch) => (
                    <MenuItem key={arch.value} value={arch.value}>
                      <Box>
                        <Typography variant="body2">{arch.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {arch.description}
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
                  {LAMBDA_MEMORY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body2">{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ~{option.vcpu} vCPU
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Average Duration */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Average Duration (milliseconds)"
                type="number"
                value={config.avgDuration}
                onChange={(e) =>
                  handleConfigChange('avgDuration', parseInt(e.target.value) || 100)
                }
                helperText={`${(config.avgDuration / 1000).toFixed(2)} seconds`}
                InputProps={{ inputProps: { min: 1, max: 900000, step: 10 } }}
              />
            </Grid>

            {/* Function Configuration Summary */}
            {memoryOption && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'warning.light',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Function Configuration
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Memory
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {config.memory} MB
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Est. vCPU
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {memoryOption.vcpu}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {config.avgDuration} ms
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Per Invocation
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        ${(costPerInvocation * 1000000).toFixed(6)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Usage Configuration Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Usage & Invocations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Requests per Month */}
            <Grid item xs={12}>
              <Typography gutterBottom>
                Invocations per Month: {config.requestsPerMonth.toLocaleString()}
              </Typography>
              <Slider
                value={config.requestsPerMonth}
                onChange={(e, value) => handleConfigChange('requestsPerMonth', value)}
                min={1000}
                max={100000000}
                step={100000}
                scale={(x) => x}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)}M`}
                marks={[
                  { value: 1000, label: '1K' },
                  { value: 1000000, label: '1M' },
                  { value: 10000000, label: '10M' },
                  { value: 100000000, label: '100M' },
                ]}
              />
            </Grid>

            {/* Alternative text input for precise values */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invocations per Month (precise)"
                type="number"
                value={config.requestsPerMonth}
                onChange={(e) =>
                  handleConfigChange('requestsPerMonth', parseInt(e.target.value) || 1000)
                }
                helperText={`${(config.requestsPerMonth / 1000000).toFixed(2)} million`}
                InputProps={{ inputProps: { min: 1, step: 1000 } }}
              />
            </Grid>

            {/* GB-seconds calculation */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Total Compute (GB-seconds)
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatGBSeconds(totalGBSeconds)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cost.breakdown?.billableGBSeconds > 0 &&
                    `Billable: ${formatGBSeconds(cost.breakdown.billableGBSeconds)}`}
                </Typography>
              </Box>
            </Grid>

            {/* Free Tier Info */}
            <Grid item xs={12}>
              <Alert severity="info">
                <strong>AWS Free Tier:</strong> {LAMBDA_FREE_TIER.requests.toLocaleString()}{' '}
                requests and {LAMBDA_FREE_TIER.computeGBSeconds.toLocaleString()} GB-seconds per
                month are free.
              </Alert>
            </Grid>

            {/* Apply Free Tier Toggle */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.applyFreeTier}
                    onChange={(e) => handleConfigChange('applyFreeTier', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">Apply Free Tier</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Deduct free tier allowance from monthly costs
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Advanced Configuration Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Advanced Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Ephemeral Storage */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ephemeral Storage (/tmp) - MB"
                type="number"
                value={config.ephemeralStorage}
                onChange={(e) =>
                  handleConfigChange('ephemeralStorage', parseInt(e.target.value) || 512)
                }
                helperText={`${LAMBDA_EPHEMERAL_STORAGE.included} MB included, max ${LAMBDA_EPHEMERAL_STORAGE.max} MB`}
                InputProps={{
                  inputProps: {
                    min: LAMBDA_EPHEMERAL_STORAGE.included,
                    max: LAMBDA_EPHEMERAL_STORAGE.max,
                    step: 64,
                  },
                }}
              />
            </Grid>

            {/* Provisioned Concurrency Toggle */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.useProvisionedConcurrency}
                    onChange={(e) =>
                      handleConfigChange('useProvisionedConcurrency', e.target.checked)
                    }
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box>
                      <Typography variant="body2">Provisioned Concurrency</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Keep functions warm for consistent low-latency responses
                      </Typography>
                    </Box>
                    <Tooltip title="Provisioned Concurrency keeps functions initialized and ready to respond in double-digit milliseconds">
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Box>
                }
              />
            </Grid>

            {/* Provisioned Concurrency Configuration */}
            {config.useProvisionedConcurrency && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Number of Provisioned Instances"
                    type="number"
                    value={config.provisionedConcurrency}
                    onChange={(e) =>
                      handleConfigChange(
                        'provisionedConcurrency',
                        parseInt(e.target.value) || 0
                      )
                    }
                    helperText="Number of concurrent executions to keep warm"
                    InputProps={{ inputProps: { min: 0, max: 1000, step: 1 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Provisioned Hours per Month"
                    type="number"
                    value={config.provisionedConcurrencyHours}
                    onChange={(e) =>
                      handleConfigChange(
                        'provisionedConcurrencyHours',
                        parseInt(e.target.value) || 730
                      )
                    }
                    helperText="730 hours = 24/7"
                    InputProps={{ inputProps: { min: 1, max: 730, step: 1 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="warning">
                    Provisioned Concurrency incurs additional charges based on the amount of
                    concurrency configured and the duration it is enabled.
                  </Alert>
                </Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Cost Summary */}
      <Box mt={3} p={3} sx={{ bgcolor: 'warning.light', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="warning.dark">
          Estimated Monthly Cost
        </Typography>
        <Typography variant="h3" fontWeight="bold" color="warning.main" gutterBottom>
          ${cost.monthlyCost.toFixed(2)}
        </Typography>

        {cost.breakdown && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Cost Breakdown:
            </Typography>
            <Grid container spacing={1}>
              {cost.breakdown.requestCost !== undefined && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Request Charges:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.requestCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.durationCost !== undefined && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Duration Charges:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.durationCost?.toFixed(2)}
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

              {cost.breakdown.provisionedConcurrencyCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Provisioned Concurrency:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.provisionedConcurrencyCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.provisionedConcurrencyRequestCost > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Provisioned Requests:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${cost.breakdown.provisionedConcurrencyRequestCost?.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              {cost.breakdown.freeTierSavings > 0 && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="success.main">
                      Free Tier Savings:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right" color="success.main">
                      -${cost.breakdown.freeTierSavings?.toFixed(2)}
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
                  Billable: {cost.breakdown.billableRequests?.toLocaleString()} requests,{' '}
                  {formatGBSeconds(cost.breakdown.billableGBSeconds || 0)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default LambdaConfigForm;
