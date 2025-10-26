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
  Grid,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  ROUTE53_DOMAIN_REGISTRATION,
  calculateRoute53Cost,
} from '../../data/route53Data';

const Route53ConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    hostedZones: 1,
    standardQueries: 10000000,
    latencyQueries: 0,
    geoQueries: 0,
    awsHealthChecks: 0,
    nonAwsHealthChecks: 0,
    healthChecksWithMetrics: 0,
    trafficFlowPolicyRecords: 0,
    trafficFlowQueries: 0,
    domainRegistrations: 0,
    domainRegistrationType: '.com',
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => {
    onCostUpdateRef.current = onCostUpdate;
  }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateRoute53Cost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonRoute53',
        serviceName: 'Route 53 (DNS)',
        configuration: config,
        monthlyCost: calculatedCost.monthlyCost,
      });
    }
  }, [config]);

  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Route 53 Configuration
          </Typography>
          <Chip label="DNS" color="secondary" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Hosted Zones & Queries</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hosted Zones"
                type="number"
                value={config.hostedZones}
                onChange={(e) => handleConfigChange('hostedZones', parseInt(e.target.value) || 0)}
                helperText="$0.50 per zone (first 25), $0.10 after"
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Standard Queries (per month)"
                type="number"
                value={config.standardQueries}
                onChange={(e) => handleConfigChange('standardQueries', parseInt(e.target.value) || 0)}
                helperText="$0.40 per million (first 1B)"
                InputProps={{ inputProps: { min: 0, step: 1000000 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latency-Based Queries (per month)"
                type="number"
                value={config.latencyQueries}
                onChange={(e) => handleConfigChange('latencyQueries', parseInt(e.target.value) || 0)}
                helperText="$0.60 per million (first 1B)"
                InputProps={{ inputProps: { min: 0, step: 1000000 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Geo DNS Queries (per month)"
                type="number"
                value={config.geoQueries}
                onChange={(e) => handleConfigChange('geoQueries', parseInt(e.target.value) || 0)}
                helperText="$0.70 per million (first 1B)"
                InputProps={{ inputProps: { min: 0, step: 1000000 } }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Health Checks & Traffic Flow</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="AWS Endpoint Health Checks"
                type="number"
                value={config.awsHealthChecks}
                onChange={(e) => handleConfigChange('awsHealthChecks', parseInt(e.target.value) || 0)}
                helperText="$0.50 per check per month"
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Non-AWS Endpoint Checks"
                type="number"
                value={config.nonAwsHealthChecks}
                onChange={(e) => handleConfigChange('nonAwsHealthChecks', parseInt(e.target.value) || 0)}
                helperText="$0.75 per check per month"
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Checks with CloudWatch Metrics"
                type="number"
                value={config.healthChecksWithMetrics}
                onChange={(e) => handleConfigChange('healthChecksWithMetrics', parseInt(e.target.value) || 0)}
                helperText="$1.00 per check per month"
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Traffic Flow Policy Records"
                type="number"
                value={config.trafficFlowPolicyRecords}
                onChange={(e) => handleConfigChange('trafficFlowPolicyRecords', parseInt(e.target.value) || 0)}
                helperText="$50 per policy record per month"
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Traffic Flow Queries (per month)"
                type="number"
                value={config.trafficFlowQueries}
                onChange={(e) => handleConfigChange('trafficFlowQueries', parseInt(e.target.value) || 0)}
                helperText="$0.001 per million queries"
                InputProps={{ inputProps: { min: 0, step: 1000000 } }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Domain Registration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Domain Registrations"
                type="number"
                value={config.domainRegistrations}
                onChange={(e) => handleConfigChange('domainRegistrations', parseInt(e.target.value) || 0)}
                helperText="Annual cost amortized monthly"
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Domain Type</InputLabel>
                <Select
                  value={config.domainRegistrationType}
                  label="Domain Type"
                  onChange={(e) => handleConfigChange('domainRegistrationType', e.target.value)}
                >
                  {Object.keys(ROUTE53_DOMAIN_REGISTRATION).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type} - ${ROUTE53_DOMAIN_REGISTRATION[type]}/year
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box mt={3} p={3} sx={{ bgcolor: 'success.light', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="success.dark">
          Estimated Monthly Cost
        </Typography>
        <Typography variant="h3" fontWeight="bold" color="success.main" gutterBottom>
          ${cost.monthlyCost.toFixed(2)}
        </Typography>
        {cost.breakdown && cost.breakdown.length > 0 && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Cost Breakdown:
            </Typography>
            <Grid container spacing={1}>
              {cost.breakdown.map((item, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={8}>
                    <Typography variant="body2">{item.category}:</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" align="right">
                      ${item.monthlyCost.toFixed(2)}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
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
                  ${cost.annualCost.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Route53ConfigForm;
