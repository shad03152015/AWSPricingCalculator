import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider,
  FormControlLabel, Switch,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_GATEWAY_TYPES, API_GATEWAY_CACHE, calculateAPIGatewayCost } from '../../data/apiGatewayData';

const APIGatewayConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    apiType: 'REST',
    requests: 10000000,
    connectionMinutes: 0,
    messages: 0,
    cachingEnabled: false,
    cacheSize: '0.5GB',
    cacheHoursPerMonth: 0,
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateAPIGatewayCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonAPIGateway',
        serviceName: 'API Gateway',
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
          <Typography variant="h5" fontWeight="bold" color="primary">API Gateway Configuration</Typography>
          <Chip label="API" color="warning" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">API Configuration</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>API Type</InputLabel>
                <Select value={config.apiType} label="API Type" onChange={(e) => handleConfigChange('apiType', e.target.value)}>
                  {API_GATEWAY_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box><Typography variant="body2">{type.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{type.description}</Typography></Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {config.apiType !== 'WebSocket' && (
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="API Requests (per month)" type="number" value={config.requests}
                  onChange={(e) => handleConfigChange('requests', parseInt(e.target.value) || 0)}
                  helperText={config.apiType === 'REST' ? '$3.50 per million (first 333M)' : '$1.00 per million (first 300M)'}
                  InputProps={{ inputProps: { min: 0, step: 1000000 } }} />
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {config.apiType === 'WebSocket' && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">WebSocket Configuration</Typography></AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Connection Minutes (per month)" type="number" value={config.connectionMinutes}
                  onChange={(e) => handleConfigChange('connectionMinutes', parseInt(e.target.value) || 0)}
                  helperText="$0.25 per million connection minutes"
                  InputProps={{ inputProps: { min: 0, step: 1000000 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Messages (per month)" type="number" value={config.messages}
                  onChange={(e) => handleConfigChange('messages', parseInt(e.target.value) || 0)}
                  helperText="$1.00 per million (first 1B)"
                  InputProps={{ inputProps: { min: 0, step: 1000000 } }} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Caching Options</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel control={<Switch checked={config.cachingEnabled}
                onChange={(e) => handleConfigChange('cachingEnabled', e.target.checked)} />}
                label={<Box><Typography variant="body2">Enable API Caching</Typography>
                <Typography variant="caption" color="text.secondary">Cache API responses at edge</Typography></Box>} />
            </Grid>
            {config.cachingEnabled && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Cache Size</InputLabel>
                    <Select value={config.cacheSize} label="Cache Size"
                      onChange={(e) => handleConfigChange('cacheSize', e.target.value)}>
                      {Object.keys(API_GATEWAY_CACHE).map((size) => (
                        <MenuItem key={size} value={size}>{size} - ${API_GATEWAY_CACHE[size]}/hour</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Cache Hours Per Month" type="number" value={config.cacheHoursPerMonth}
                    onChange={(e) => handleConfigChange('cacheHoursPerMonth', parseInt(e.target.value) || 0)}
                    helperText="730 hours = full month"
                    InputProps={{ inputProps: { min: 0, max: 730, step: 1 } }} />
                </Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box mt={3} p={3} sx={{ bgcolor: 'success.light', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="success.dark">Estimated Monthly Cost</Typography>
        <Typography variant="h3" fontWeight="bold" color="success.main" gutterBottom>${cost.monthlyCost.toFixed(2)}</Typography>
        {cost.breakdown && cost.breakdown.length > 0 && (
          <Box mt={2}><Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Cost Breakdown:</Typography>
            <Grid container spacing={1}>
              {cost.breakdown.map((item, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={8}><Typography variant="body2">{item.category}:</Typography>
                  <Typography variant="caption" color="text.secondary">{item.description}</Typography></Grid>
                  <Grid item xs={4}><Typography variant="body2" align="right">${item.monthlyCost.toFixed(2)}</Typography></Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
              <Grid item xs={6}><Typography variant="body2" fontWeight="bold">Annual Cost:</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" fontWeight="bold" align="right">${cost.annualCost.toFixed(2)}</Typography></Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default APIGatewayConfigForm;
