import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  calculateEKSCost,
  EKS_COMPUTE_TYPES,
  EKS_EC2_INSTANCE_TYPES,
  EKS_EBS_VOLUME_TYPES,
  EKS_FARGATE_POD_SIZES,
  EKS_REGIONAL_MULTIPLIERS,
  EKS_USE_CASE_TEMPLATES,
  EKS_CLUSTER_MONTHLY_COST,
} from '../../data/eksData';

function EKSConfigForm({ onRemove, onCostUpdate }) {
  const [config, setConfig] = useState({
    region: 'us-east-1',
    clusterCount: 1,
    computeType: 'ec2',

    // EC2 Node Group Config
    ec2NodeCount: 3,
    ec2InstanceType: 't3.medium',
    ec2VolumeSize: 20,
    ec2VolumeType: 'gp3',

    // Fargate Config
    fargatePodCount: 10,
    fargatePodVCPU: 0.25,
    fargatePodMemory: 0.5,

    // Hybrid Config
    hybridEc2Nodes: 2,
    hybridFargatePods: 5,
  });

  const [costData, setCostData] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState('');

  // Calculate cost whenever config changes
  useEffect(() => {
    const result = calculateEKSCost(config);
    setCostData(result);
    onCostUpdate(result);
  }, [config, onCostUpdate]);

  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUseCaseChange = (event) => {
    const templateName = event.target.value;
    setSelectedUseCase(templateName);

    if (templateName) {
      const template = EKS_USE_CASE_TEMPLATES.find((t) => t.name === templateName);
      if (template) {
        setConfig((prev) => ({
          ...prev,
          ...template.config,
        }));
      }
    }
  };

  // Get available memory options based on selected vCPU
  const getAvailableMemoryOptions = () => {
    const podSize = EKS_FARGATE_POD_SIZES.find((p) => p.vcpu === config.fargatePodVCPU);
    return podSize?.memory || [0.5];
  };

  // Get selected EC2 instance details
  const getSelectedInstanceDetails = () => {
    return EKS_EC2_INSTANCE_TYPES.find((i) => i.value === config.ec2InstanceType);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold">
            EKS - Elastic Kubernetes Service
          </Typography>
          <Chip label="Containers" color="info" size="small" />
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={onRemove}
        >
          Remove
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Quick Start Templates */}
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel>Quick Start Template (Optional)</InputLabel>
          <Select value={selectedUseCase} onChange={handleUseCaseChange} label="Quick Start Template (Optional)">
            <MenuItem value="">
              <em>Custom Configuration</em>
            </MenuItem>
            {EKS_USE_CASE_TEMPLATES.map((template) => (
              <MenuItem key={template.name} value={template.name}>
                <Box>
                  <Typography variant="body1">{template.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {template.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Base Configuration */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Base Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={config.region}
                  onChange={(e) => handleConfigChange('region', e.target.value)}
                  label="Region"
                >
                  {Object.entries(EKS_REGIONAL_MULTIPLIERS).map(([key, data]) => (
                    <MenuItem key={key} value={key}>
                      {data.name} {data.multiplier !== 1.0 && `(${data.multiplier}x)`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Clusters"
                type="number"
                value={config.clusterCount}
                onChange={(e) => handleConfigChange('clusterCount', parseInt(e.target.value) || 1)}
                inputProps={{ min: 1, max: 10 }}
                helperText={`$${EKS_CLUSTER_MONTHLY_COST.toFixed(2)}/month per cluster`}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Compute Type</InputLabel>
                <Select
                  value={config.computeType}
                  onChange={(e) => handleConfigChange('computeType', e.target.value)}
                  label="Compute Type"
                >
                  {EKS_COMPUTE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box>
                        <Typography variant="body1">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* EC2 Node Groups Configuration */}
      {(config.computeType === 'ec2' || config.computeType === 'hybrid') && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">EC2 Node Groups</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  EC2 node groups provide managed EC2 instances for running your Kubernetes workloads. You pay standard EC2 pricing plus EBS storage.
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Nodes"
                  type="number"
                  value={config.computeType === 'hybrid' ? config.hybridEc2Nodes : config.ec2NodeCount}
                  onChange={(e) =>
                    handleConfigChange(
                      config.computeType === 'hybrid' ? 'hybridEc2Nodes' : 'ec2NodeCount',
                      parseInt(e.target.value) || 1
                    )
                  }
                  inputProps={{ min: 1, max: 100 }}
                  helperText="Recommended: 3+ for high availability"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Instance Type</InputLabel>
                  <Select
                    value={config.ec2InstanceType}
                    onChange={(e) => handleConfigChange('ec2InstanceType', e.target.value)}
                    label="Instance Type"
                  >
                    {['T3', 'M5', 'C5', 'R5'].map((family) => [
                      <MenuItem key={`header-${family}`} disabled>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                          {family} Family
                        </Typography>
                      </MenuItem>,
                      ...EKS_EC2_INSTANCE_TYPES.filter((i) => i.family === family).map((instance) => (
                        <MenuItem key={instance.value} value={instance.value}>
                          {instance.label} - {instance.vcpu} vCPU, {instance.memory}GB RAM (${instance.pricePerHour.toFixed(4)}/hr)
                        </MenuItem>
                      )),
                    ])}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Root Volume Size (GB)"
                  type="number"
                  value={config.ec2VolumeSize}
                  onChange={(e) => handleConfigChange('ec2VolumeSize', parseInt(e.target.value) || 20)}
                  inputProps={{ min: 20, max: 1000 }}
                  helperText="Storage for each node's root volume"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Volume Type</InputLabel>
                  <Select
                    value={config.ec2VolumeType}
                    onChange={(e) => handleConfigChange('ec2VolumeType', e.target.value)}
                    label="Volume Type"
                  >
                    {EKS_EBS_VOLUME_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label} - ${type.pricePerGBMonth.toFixed(3)}/GB-month
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {getSelectedInstanceDetails() && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Instance Details
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Instance Type:</strong></TableCell>
                          <TableCell>{getSelectedInstanceDetails().label}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>vCPUs:</strong></TableCell>
                          <TableCell>{getSelectedInstanceDetails().vcpu}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Memory:</strong></TableCell>
                          <TableCell>{getSelectedInstanceDetails().memory} GB</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Hourly Cost:</strong></TableCell>
                          <TableCell>${getSelectedInstanceDetails().pricePerHour.toFixed(4)}/hour</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Fargate Configuration */}
      {(config.computeType === 'fargate' || config.computeType === 'hybrid') && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Fargate Pods</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  AWS Fargate runs Kubernetes pods without managing servers. You pay for vCPU and memory resources used per second.
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Pods"
                  type="number"
                  value={config.computeType === 'hybrid' ? config.hybridFargatePods : config.fargatePodCount}
                  onChange={(e) =>
                    handleConfigChange(
                      config.computeType === 'hybrid' ? 'hybridFargatePods' : 'fargatePodCount',
                      parseInt(e.target.value) || 1
                    )
                  }
                  inputProps={{ min: 1, max: 1000 }}
                  helperText="Average number of running pods"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>vCPU per Pod</InputLabel>
                  <Select
                    value={config.fargatePodVCPU}
                    onChange={(e) => {
                      const newVCPU = e.target.value;
                      const availableMemory = EKS_FARGATE_POD_SIZES.find((p) => p.vcpu === newVCPU)?.memory || [0.5];
                      handleConfigChange('fargatePodVCPU', newVCPU);

                      // Reset memory if current value not available for new vCPU
                      if (!availableMemory.includes(config.fargatePodMemory)) {
                        handleConfigChange('fargatePodMemory', availableMemory[0]);
                      }
                    }}
                    label="vCPU per Pod"
                  >
                    {EKS_FARGATE_POD_SIZES.map((size) => (
                      <MenuItem key={size.vcpu} value={size.vcpu}>
                        {size.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Memory per Pod (GB)</InputLabel>
                  <Select
                    value={config.fargatePodMemory}
                    onChange={(e) => handleConfigChange('fargatePodMemory', e.target.value)}
                    label="Memory per Pod (GB)"
                  >
                    {getAvailableMemoryOptions().map((mem) => (
                      <MenuItem key={mem} value={mem}>
                        {mem} GB
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Fargate Pod Pricing
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>vCPU Cost:</strong></TableCell>
                        <TableCell>$0.04048 per vCPU-hour</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Memory Cost:</strong></TableCell>
                        <TableCell>$0.004445 per GB-hour</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Per Pod (24/7):</strong></TableCell>
                        <TableCell>
                          ${((config.fargatePodVCPU * 0.04048 + config.fargatePodMemory * 0.004445) * 730).toFixed(2)}/month
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Cost Summary */}
      {costData && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Cost Summary</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Table>
                <TableBody>
                  {costData.breakdown.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2">
                          <strong>{item.category}</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          ${item.monthlyCost.toFixed(2)}/mo
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider sx={{ my: 1 }} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Total Monthly Cost</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Region: {costData.configuration.region}
                        {costData.regionalMultiplier !== 1.0 && ` (${costData.regionalMultiplier}x multiplier)`}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        ${costData.monthlyCost.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${costData.annualCost.toFixed(2)}/year
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
}

export default EKSConfigForm;
