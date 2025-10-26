import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { calculateSystemsManagerCost } from '../../data/systemsmanagerData';

const SystemsManagerConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    opsItems: 100,
    parameterStoreAdvancedAPICalls: 10000,
    automationSteps: 1000
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateSystemsManagerCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AWSSystemsManager',
        serviceName: 'Systems Manager',
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
          <Typography variant="h5" fontWeight="bold" color="primary">Systems Manager Configuration</Typography>
          <Chip label="Operations" color="primary" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Operations Configuration</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="OpsCenter OpsItems (per month)" type="number" value={config.opsItems}
                onChange={(e) => handleConfigChange('opsItems', parseInt(e.target.value) || 0)}
                helperText="$0.10 per OpsItem"
                InputProps={{ inputProps: { min: 0, step: 10 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Parameter Store Advanced API Calls" type="number" value={config.parameterStoreAdvancedAPICalls}
                onChange={(e) => handleConfigChange('parameterStoreAdvancedAPICalls', parseInt(e.target.value) || 0)}
                helperText="$0.05 per 10,000 calls"
                InputProps={{ inputProps: { min: 0, step: 10000 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Automation Steps (per month)" type="number" value={config.automationSteps}
                onChange={(e) => handleConfigChange('automationSteps', parseInt(e.target.value) || 0)}
                helperText="$0.002 per step"
                InputProps={{ inputProps: { min: 0, step: 100 } }} />
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

export default SystemsManagerConfigForm;
