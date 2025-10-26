import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider, FormControlLabel, Switch,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { DYNAMODB_CAPACITY_MODES, calculateDynamoDBCost } from '../../data/dynamodbData';

const DynamoDBConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    capacityMode: 'onDemand',
    writeRequests: 10000000,
    readRequests: 50000000,
    provisionedWriteCapacity: 100,
    provisionedReadCapacity: 500,
    storageGB: 100,
    infrequentAccessStorageGB: 0,
    continuousBackupEnabled: false,
    onDemandBackupsGB: 0,
    globalTablesEnabled: false,
    streamsEnabled: false,
    streamsReadRequests: 0,
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateDynamoDBCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonDynamoDB',
        serviceName: 'DynamoDB',
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
          <Typography variant="h5" fontWeight="bold" color="primary">DynamoDB Configuration</Typography>
          <Chip label="NoSQL" color="primary" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Capacity Mode</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Capacity Mode</InputLabel>
                <Select value={config.capacityMode} label="Capacity Mode" onChange={(e) => handleConfigChange('capacityMode', e.target.value)}>
                  {DYNAMODB_CAPACITY_MODES.map((mode) => (
                    <MenuItem key={mode.value} value={mode.value}>
                      <Box><Typography variant="body2">{mode.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{mode.description}</Typography></Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {config.capacityMode === 'onDemand' ? (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">On-Demand Requests</Typography></AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Write Requests (per month)" type="number" value={config.writeRequests}
                  onChange={(e) => handleConfigChange('writeRequests', parseInt(e.target.value) || 0)}
                  helperText="$1.25 per million WRUs"
                  InputProps={{ inputProps: { min: 0, step: 1000000 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Read Requests (per month)" type="number" value={config.readRequests}
                  onChange={(e) => handleConfigChange('readRequests', parseInt(e.target.value) || 0)}
                  helperText="$0.25 per million RRUs"
                  InputProps={{ inputProps: { min: 0, step: 1000000 } }} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ) : (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Provisioned Capacity</Typography></AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Provisioned Write Capacity Units (WCUs)" type="number" value={config.provisionedWriteCapacity}
                  onChange={(e) => handleConfigChange('provisionedWriteCapacity', parseInt(e.target.value) || 0)}
                  helperText="$0.00065 per WCU per hour"
                  InputProps={{ inputProps: { min: 0, step: 10 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Provisioned Read Capacity Units (RCUs)" type="number" value={config.provisionedReadCapacity}
                  onChange={(e) => handleConfigChange('provisionedReadCapacity', parseInt(e.target.value) || 0)}
                  helperText="$0.00013 per RCU per hour"
                  InputProps={{ inputProps: { min: 0, step: 10 } }} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Storage & Features</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Standard Storage (GB)" type="number" value={config.storageGB}
                onChange={(e) => handleConfigChange('storageGB', parseFloat(e.target.value) || 0)}
                helperText="$0.25 per GB-month"
                InputProps={{ inputProps: { min: 0, step: 10 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Infrequent Access Storage (GB)" type="number" value={config.infrequentAccessStorageGB}
                onChange={(e) => handleConfigChange('infrequentAccessStorageGB', parseFloat(e.target.value) || 0)}
                helperText="$0.10 per GB-month"
                InputProps={{ inputProps: { min: 0, step: 10 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel control={<Switch checked={config.continuousBackupEnabled}
                onChange={(e) => handleConfigChange('continuousBackupEnabled', e.target.checked)} />}
                label="Continuous Backup ($0.20/GB-month)" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel control={<Switch checked={config.globalTablesEnabled}
                onChange={(e) => handleConfigChange('globalTablesEnabled', e.target.checked)} />}
                label="Global Tables ($1.875/million rWRU)" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel control={<Switch checked={config.streamsEnabled}
                onChange={(e) => handleConfigChange('streamsEnabled', e.target.checked)} />}
                label="DynamoDB Streams" />
            </Grid>
            {config.streamsEnabled && (
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Streams Read Requests (per month)" type="number" value={config.streamsReadRequests}
                  onChange={(e) => handleConfigChange('streamsReadRequests', parseInt(e.target.value) || 0)}
                  helperText="$0.02 per 100,000 requests"
                  InputProps={{ inputProps: { min: 0, step: 100000 } }} />
              </Grid>
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

export default DynamoDBConfigForm;
