import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { calculateCloudWatchCost } from '../../data/cloudwatchData';

const CloudWatchConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    customMetrics: 50,
    standardMetrics: 10,
    logsIngestionGB: 10,
    logsStorageGB: 50,
    dashboards: 3,
    alarms: 10
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateCloudWatchCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonCloudWatch',
        serviceName: 'CloudWatch',
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
          <Typography variant="h5" fontWeight="bold" color="primary">CloudWatch Configuration</Typography>
          <Chip label="Monitoring" color="error" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Metrics & Monitoring</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Custom Metrics" type="number" value={config.customMetrics}
                onChange={(e) => handleConfigChange('customMetrics', parseInt(e.target.value) || 0)}
                helperText="$0.30 per metric per month (first 10 free)"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Standard Metrics" type="number" value={config.standardMetrics}
                onChange={(e) => handleConfigChange('standardMetrics', parseInt(e.target.value) || 0)}
                helperText="Free"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Alarms" type="number" value={config.alarms}
                onChange={(e) => handleConfigChange('alarms', parseInt(e.target.value) || 0)}
                helperText="$0.10 per alarm per month"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Dashboards" type="number" value={config.dashboards}
                onChange={(e) => handleConfigChange('dashboards', parseInt(e.target.value) || 0)}
                helperText="$3 per dashboard per month"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Logs</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Logs Ingestion (GB per month)" type="number" value={config.logsIngestionGB}
                onChange={(e) => handleConfigChange('logsIngestionGB', parseFloat(e.target.value) || 0)}
                helperText="$0.50 per GB"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Logs Storage (GB per month)" type="number" value={config.logsStorageGB}
                onChange={(e) => handleConfigChange('logsStorageGB', parseFloat(e.target.value) || 0)}
                helperText="$0.03 per GB"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
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

export default CloudWatchConfigForm;
