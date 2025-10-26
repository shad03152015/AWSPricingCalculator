import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { DOCUMENTDB_INSTANCE_TYPES, calculateDocumentDBCost } from '../../data/documentdbData';

const DocumentDBConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    instanceType: 'db.r6g.large',
    numberOfInstances: 3,
    storageGB: 100,
    ioRequests: 1000000,
    backupStorageGB: 100,
    dataTransferOutGB: 100,
    region: 'us-east-1',
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateDocumentDBCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonDocumentDB',
        serviceName: 'DocumentDB',
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
          <Typography variant="h5" fontWeight="bold" color="primary">DocumentDB Configuration</Typography>
          <Chip label="MongoDB" color="success" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Instance Configuration</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Instance Type</InputLabel>
                <Select value={config.instanceType} label="Instance Type" onChange={(e) => handleConfigChange('instanceType', e.target.value)}>
                  {Object.keys(DOCUMENTDB_INSTANCE_TYPES).map((type) => {
                    const inst = DOCUMENTDB_INSTANCE_TYPES[type];
                    return <MenuItem key={type} value={type}>{type} - {inst.vcpu} vCPU, {inst.memory}GB RAM - ${inst.pricePerHour}/hr</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Number of Instances" type="number" value={config.numberOfInstances}
                onChange={(e) => handleConfigChange('numberOfInstances', parseInt(e.target.value) || 0)}
                helperText="Cluster size"
                InputProps={{ inputProps: { min: 1, step: 1 } }} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Storage & I/O</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Storage (GB)" type="number" value={config.storageGB}
                onChange={(e) => handleConfigChange('storageGB', parseFloat(e.target.value) || 0)}
                helperText="$0.10 per GB-month"
                InputProps={{ inputProps: { min: 0, step: 10 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="I/O Requests (per month)" type="number" value={config.ioRequests}
                onChange={(e) => handleConfigChange('ioRequests', parseInt(e.target.value) || 0)}
                helperText="$0.20 per million requests"
                InputProps={{ inputProps: { min: 0, step: 1000000 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Backup Storage (GB)" type="number" value={config.backupStorageGB}
                onChange={(e) => handleConfigChange('backupStorageGB', parseFloat(e.target.value) || 0)}
                helperText="$0.021 per GB-month"
                InputProps={{ inputProps: { min: 0, step: 10 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Data Transfer Out (GB/month)" type="number" value={config.dataTransferOutGB}
                onChange={(e) => handleConfigChange('dataTransferOutGB', parseFloat(e.target.value) || 0)}
                helperText="First 1GB free, $0.09/GB after"
                InputProps={{ inputProps: { min: 0, step: 10 } }} />
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

export default DocumentDBConfigForm;
