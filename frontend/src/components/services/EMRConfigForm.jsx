import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { calculateEMRCost } from '../../data/emrData';

const EMRConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    instanceType: 'm5.xlarge',
    numberOfInstances: 5,
    hoursPerMonth: 730,
    ebsStorageGB: 500,
    region: 'us-east-1
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateEMRCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonEMR',
        serviceName: 'EMR',
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
          <Typography variant="h5" fontWeight="bold" color="primary">EMR Configuration</Typography>
          <Chip label="Big Data" color="warning" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Cluster Configuration</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Instance Type" type="text" value={config.instanceType}
                onChange={(e) => handleConfigChange('instanceType', e.target.value)}
                helperText="e.g., m5.xlarge, c5.4xlarge"
                />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Number of Instances" type="number" value={config.numberOfInstances}
                onChange={(e) => handleConfigChange('numberOfInstances', parseInt(e.target.value) || 0)}
                helperText="Cluster size"
                InputProps={{ inputProps: { min: 1, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Hours Per Month" type="number" value={config.hoursPerMonth}
                onChange={(e) => handleConfigChange('hoursPerMonth', parseInt(e.target.value) || 0)}
                helperText="730 hours = full month"
                InputProps={{ inputProps: { min: 0, max: 730, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="EBS Storage (GB)" type="number" value={config.ebsStorageGB}
                onChange={(e) => handleConfigChange('ebsStorageGB', parseFloat(e.target.value) || 0)}
                helperText="$0.10 per GB-month"
                InputProps={{ inputProps: { min: 0, step: 50 } }} />
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

export default EMRConfigForm;
