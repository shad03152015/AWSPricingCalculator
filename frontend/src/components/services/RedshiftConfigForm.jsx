import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { REDSHIFT_NODE_TYPES, calculateRedshiftCost } from '../../data/redshiftData';

const RedshiftConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    nodeType: 'ra3.xlplus',
    numberOfNodes: 2,
    storageGB: 1000,
    spectrumDataScannedTB: 10,
    concurrencyScalingHours: 0,
    dataTransferOutGB: 100,
    region: 'us-east-1',
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateRedshiftCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonRedshift',
        serviceName: 'Redshift',
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
          <Typography variant="h5" fontWeight="bold" color="primary">Redshift Configuration</Typography>
          <Chip label="Data Warehouse" color="primary" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Cluster Configuration</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Node Type</InputLabel>
                <Select value={config.nodeType} label="Node Type" onChange={(e) => handleConfigChange('nodeType', e.target.value)}>
                  {Object.keys(REDSHIFT_NODE_TYPES).map((type) => {
                    const node = REDSHIFT_NODE_TYPES[type];
                    return <MenuItem key={type} value={type}>{type} - {node.vcpu} vCPU, {node.memory}GB RAM - ${node.pricePerHour}/hr</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Number of Nodes" type="number" value={config.numberOfNodes}
                onChange={(e) => handleConfigChange('numberOfNodes', parseInt(e.target.value) || 0)}
                helperText="Cluster size"
                InputProps={{ inputProps: { min: 1, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Managed Storage (GB)" type="number" value={config.storageGB}
                onChange={(e) => handleConfigChange('storageGB', parseFloat(e.target.value) || 0)}
                helperText="$0.024 per GB-month (RA3 nodes)"
                InputProps={{ inputProps: { min: 0, step: 100 } }} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Additional Features</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Spectrum Data Scanned (TB/month)" type="number" value={config.spectrumDataScannedTB}
                onChange={(e) => handleConfigChange('spectrumDataScannedTB', parseFloat(e.target.value) || 0)}
                helperText="$5 per TB scanned"
                InputProps={{ inputProps: { min: 0, step: 1 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Concurrency Scaling (hours/month)" type="number" value={config.concurrencyScalingHours}
                onChange={(e) => handleConfigChange('concurrencyScalingHours', parseInt(e.target.value) || 0)}
                helperText="$5 per hour"
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

export default RedshiftConfigForm;
