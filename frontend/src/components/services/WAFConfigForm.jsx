import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { calculateWAFCost } from '../../data/wafData';

const WAFConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    webACLs: 1,
    rules: 10,
    requestsPerMonth: 10000000
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateWAFCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AWSWAF',
        serviceName: 'WAF',
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
          <Typography variant="h5" fontWeight="bold" color="primary">WAF Configuration</Typography>
          <Chip label="Security" color="error" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">WAF Configuration</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Web ACLs" type="number" value={config.webACLs}
                onChange={(e) => handleConfigChange('webACLs', parseInt(e.target.value) || 0)}
                helperText="$5 per Web ACL per month"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Rules per Web ACL" type="number" value={config.rules}
                onChange={(e) => handleConfigChange('rules', parseInt(e.target.value) || 0)}
                helperText="$1 per rule per month"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Requests (per month)" type="number" value={config.requestsPerMonth}
                onChange={(e) => handleConfigChange('requestsPerMonth', parseInt(e.target.value) || 0)}
                helperText="$0.60 per million requests"
                InputProps={{ inputProps: { min: 0, step: 1000000 } }} />
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

export default WAFConfigForm;
