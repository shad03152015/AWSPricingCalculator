import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Grid, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { calculateSNSCost } from '../../data/snsData';

const SNSConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    publishRequests: 1000000,
    standardNotifications: 1000000,
    smsNotifications: 0,
    emailNotifications: 0,
    mobileNotifications: 0,
    httpNotifications: 0,
    sqsNotifications: 0,
    lambdaNotifications: 0,
    dataTransferGB: 10,
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });
  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => { onCostUpdateRef.current = onCostUpdate; }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateSNSCost(config);
    setCost(calculatedCost);
    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonSNS',
        serviceName: 'SNS (Notifications)',
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
          <Typography variant="h5" fontWeight="bold" color="primary">SNS Configuration</Typography>
          <Chip label="Notifications" color="info" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove}><DeleteIcon /></IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Publishing Configuration</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Publish API Requests (per month)" type="number" value={config.publishRequests}
                onChange={(e) => handleConfigChange('publishRequests', parseInt(e.target.value) || 0)}
                helperText="$0.50 per million requests"
                InputProps={{ inputProps: { min: 0, step: 100000 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Standard Notifications (per month)" type="number" value={config.standardNotifications}
                onChange={(e) => handleConfigChange('standardNotifications', parseInt(e.target.value) || 0)}
                helperText="$0.50 per million"
                InputProps={{ inputProps: { min: 0, step: 100000 } }} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Notification Delivery</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="SMS Notifications (per month)" type="number" value={config.smsNotifications}
                onChange={(e) => handleConfigChange('smsNotifications', parseInt(e.target.value) || 0)}
                helperText="$0.00645 per SMS (US)"
                InputProps={{ inputProps: { min: 0, step: 1000 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email Notifications (per month)" type="number" value={config.emailNotifications}
                onChange={(e) => handleConfigChange('emailNotifications', parseInt(e.target.value) || 0)}
                helperText="$2.00 per 100,000 emails"
                InputProps={{ inputProps: { min: 0, step: 10000 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Mobile Push Notifications (per month)" type="number" value={config.mobileNotifications}
                onChange={(e) => handleConfigChange('mobileNotifications', parseInt(e.target.value) || 0)}
                helperText="$0.50 per million"
                InputProps={{ inputProps: { min: 0, step: 100000 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="HTTP/HTTPS Notifications (per month)" type="number" value={config.httpNotifications}
                onChange={(e) => handleConfigChange('httpNotifications', parseInt(e.target.value) || 0)}
                helperText="$0.06 per 100,000"
                InputProps={{ inputProps: { min: 0, step: 10000 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="SQS Notifications (per month)" type="number" value={config.sqsNotifications}
                onChange={(e) => handleConfigChange('sqsNotifications', parseInt(e.target.value) || 0)}
                helperText="Free"
                InputProps={{ inputProps: { min: 0, step: 100000 } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Lambda Notifications (per month)" type="number" value={config.lambdaNotifications}
                onChange={(e) => handleConfigChange('lambdaNotifications', parseInt(e.target.value) || 0)}
                helperText="Free"
                InputProps={{ inputProps: { min: 0, step: 100000 } }} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Data Transfer</Typography></AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Data Transfer Out (GB/month)" type="number" value={config.dataTransferGB}
                onChange={(e) => handleConfigChange('dataTransferGB', parseFloat(e.target.value) || 0)}
                helperText="First 1GB free, $0.09/GB after"
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

export default SNSConfigForm;
