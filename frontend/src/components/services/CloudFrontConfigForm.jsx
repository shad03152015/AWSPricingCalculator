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
  CLOUDFRONT_PRICE_CLASSES,
  calculateCloudFrontCost,
} from '../../data/cloudfrontData';

const CloudFrontConfigForm = ({ onRemove, onCostUpdate }) => {
  const [config, setConfig] = useState({
    priceClass: 'PriceClass_All',
    dataTransferOutGB: 1000,
    httpRequests: 1000000,
    httpsRequests: 9000000,
    invalidationPaths: 0,
  });

  const [cost, setCost] = useState({ monthlyCost: 0, breakdown: [] });

  const onCostUpdateRef = useRef(onCostUpdate);

  useEffect(() => {
    onCostUpdateRef.current = onCostUpdate;
  }, [onCostUpdate]);

  useEffect(() => {
    const calculatedCost = calculateCloudFrontCost(config);
    setCost(calculatedCost);

    if (onCostUpdateRef.current) {
      onCostUpdateRef.current({
        serviceCode: 'AmazonCloudFront',
        serviceName: 'CloudFront (CDN)',
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
            CloudFront Configuration
          </Typography>
          <Chip label="CDN" color="info" size="small" />
        </Box>
        <IconButton color="error" onClick={onRemove} aria-label="Remove service">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Distribution Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Price Class</InputLabel>
                <Select
                  value={config.priceClass}
                  label="Price Class"
                  onChange={(e) => handleConfigChange('priceClass', e.target.value)}
                >
                  {CLOUDFRONT_PRICE_CLASSES.map((pc) => (
                    <MenuItem key={pc.value} value={pc.value}>
                      <Box>
                        <Typography variant="body2">{pc.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pc.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data Transfer Out (GB/month)"
                type="number"
                value={config.dataTransferOutGB}
                onChange={(e) =>
                  handleConfigChange('dataTransferOutGB', parseFloat(e.target.value) || 0)
                }
                helperText={`${(config.dataTransferOutGB / 1024).toFixed(2)} TB`}
                InputProps={{ inputProps: { min: 0, step: 100 } }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Request Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="HTTP Requests (per month)"
                type="number"
                value={config.httpRequests}
                onChange={(e) =>
                  handleConfigChange('httpRequests', parseInt(e.target.value) || 0)
                }
                helperText="$0.0075 per 10,000 requests"
                InputProps={{ inputProps: { min: 0, step: 100000 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="HTTPS Requests (per month)"
                type="number"
                value={config.httpsRequests}
                onChange={(e) =>
                  handleConfigChange('httpsRequests', parseInt(e.target.value) || 0)
                }
                helperText="$0.0100 per 10,000 requests"
                InputProps={{ inputProps: { min: 0, step: 100000 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invalidation Paths (per month)"
                type="number"
                value={config.invalidationPaths}
                onChange={(e) =>
                  handleConfigChange('invalidationPaths', parseInt(e.target.value) || 0)
                }
                helperText="First 1,000 paths free, $0.005 per path after"
                InputProps={{ inputProps: { min: 0, step: 100 } }}
              />
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

export default CloudFrontConfigForm;
