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
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  calculateAuroraCost,
  AURORA_COMPATIBILITY,
  AURORA_CONFIG_TYPES,
  AURORA_INSTANCE_CLASSES,
  AURORA_STORAGE,
  AURORA_REGIONAL_MULTIPLIERS,
  AURORA_USE_CASE_TEMPLATES,
  AURORA_SERVERLESS_ACU,
} from '../../data/auroraData';

function AuroraConfigForm({ onRemove, onCostUpdate }) {
  const [config, setConfig] = useState({
    region: 'us-east-1',
    compatibility: 'mysql',
    configType: 'serverless-v2',

    // Serverless v2 Config
    serverlessMinACU: 0.5,
    serverlessMaxACU: 2,
    serverlessAvgACU: 1,

    // Provisioned Config
    provisionedInstanceType: 'db.r6g.large',
    provisionedInstanceCount: 1,
    readReplicaCount: 0,

    // Global Database Config
    globalPrimaryRegion: 'us-east-1',
    globalSecondaryRegions: 0,
    globalReplicationGB: 0,

    // Storage Config
    storageGB: 10,
    storageType: 'standard',
    ioRequestsPerMonth: 0,

    // Backup Config
    backupStorageGB: 0,
    enableBacktrack: false,
    backtrackChangeRecords: 0,
  });

  const [costData, setCostData] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState('');

  // Calculate cost whenever config changes
  useEffect(() => {
    const result = calculateAuroraCost(config);
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
      const template = AURORA_USE_CASE_TEMPLATES.find((t) => t.name === templateName);
      if (template) {
        setConfig((prev) => ({
          ...prev,
          ...template.config,
        }));
      }
    }
  };

  // Get selected instance details
  const getSelectedInstanceDetails = () => {
    return AURORA_INSTANCE_CLASSES.find((i) => i.type === config.provisionedInstanceType);
  };

  // Calculate estimated monthly cost for serverless
  const calculateServerlessMonthlyCost = () => {
    const hourlyCost = config.serverlessAvgACU * AURORA_SERVERLESS_ACU.pricePerACUPerHour;
    return hourlyCost * 730;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold">
            Aurora - Cloud-Native Database
          </Typography>
          <Chip label="Database" color="secondary" size="small" />
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
            {AURORA_USE_CASE_TEMPLATES.map((template) => (
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
            <Grid item xs={12}>
              <Alert severity="info">
                Aurora is a MySQL and PostgreSQL-compatible database built for the cloud with up to 5x performance of MySQL and 3x performance of PostgreSQL.
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={config.region}
                  onChange={(e) => handleConfigChange('region', e.target.value)}
                  label="Region"
                >
                  {Object.entries(AURORA_REGIONAL_MULTIPLIERS).map(([key, data]) => (
                    <MenuItem key={key} value={key}>
                      {data.name} {data.multiplier !== 1.0 && `(${data.multiplier}x)`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Compatibility</InputLabel>
                <Select
                  value={config.compatibility}
                  onChange={(e) => handleConfigChange('compatibility', e.target.value)}
                  label="Compatibility"
                >
                  {AURORA_COMPATIBILITY.map((compat) => (
                    <MenuItem key={compat.value} value={compat.value}>
                      <Box>
                        <Typography variant="body1">{compat.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {compat.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Configuration Type</InputLabel>
                <Select
                  value={config.configType}
                  onChange={(e) => handleConfigChange('configType', e.target.value)}
                  label="Configuration Type"
                >
                  {AURORA_CONFIG_TYPES.map((type) => (
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

      {/* Serverless v2 Configuration */}
      {config.configType === 'serverless-v2' && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Serverless v2 Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Aurora Serverless v2 automatically scales capacity based on your application's needs. You pay only for the resources you use, per second.
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Minimum Capacity (ACU)</Typography>
                <Slider
                  value={config.serverlessMinACU}
                  onChange={(e, value) => handleConfigChange('serverlessMinACU', value)}
                  min={0.5}
                  max={16}
                  step={0.5}
                  marks={[
                    { value: 0.5, label: '0.5' },
                    { value: 4, label: '4' },
                    { value: 8, label: '8' },
                    { value: 16, label: '16' },
                  ]}
                  valueLabelDisplay="on"
                />
                <Typography variant="caption" color="text.secondary">
                  1 ACU = ~2 GB RAM
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Maximum Capacity (ACU)</Typography>
                <Slider
                  value={config.serverlessMaxACU}
                  onChange={(e, value) => handleConfigChange('serverlessMaxACU', value)}
                  min={config.serverlessMinACU}
                  max={128}
                  step={0.5}
                  marks={[
                    { value: config.serverlessMinACU, label: `${config.serverlessMinACU}` },
                    { value: 32, label: '32' },
                    { value: 64, label: '64' },
                    { value: 128, label: '128' },
                  ]}
                  valueLabelDisplay="on"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Average ACU Usage (for cost estimation)</Typography>
                <Slider
                  value={config.serverlessAvgACU}
                  onChange={(e, value) => handleConfigChange('serverlessAvgACU', value)}
                  min={config.serverlessMinACU}
                  max={config.serverlessMaxACU}
                  step={0.5}
                  valueLabelDisplay="on"
                />
                <Typography variant="caption" color="text.secondary">
                  Estimated monthly compute cost: ${calculateServerlessMonthlyCost().toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Provisioned Configuration */}
      {config.configType === 'provisioned' && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Provisioned Instance Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Provisioned instances provide predictable performance with dedicated capacity. Add read replicas to scale read traffic.
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Writer Instances"
                  type="number"
                  value={config.provisionedInstanceCount}
                  onChange={(e) => handleConfigChange('provisionedInstanceCount', parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, max: 5 }}
                  helperText="Primary database instances"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Read Replicas"
                  type="number"
                  value={config.readReplicaCount}
                  onChange={(e) => handleConfigChange('readReplicaCount', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0, max: 15 }}
                  helperText="Up to 15 read replicas"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Instance Type</InputLabel>
                  <Select
                    value={config.provisionedInstanceType}
                    onChange={(e) => handleConfigChange('provisionedInstanceType', e.target.value)}
                    label="Instance Type"
                  >
                    {['R6g', 'R5', 'R6i', 'X2g'].map((family) => [
                      <MenuItem key={`header-${family}`} disabled>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                          {family} Family {family.includes('g') ? '(ARM/Graviton)' : '(x86)'}
                        </Typography>
                      </MenuItem>,
                      ...AURORA_INSTANCE_CLASSES.filter((i) => i.family === family).map((instance) => (
                        <MenuItem key={instance.type} value={instance.type}>
                          {instance.type} - {instance.vcpu} vCPU, {instance.memory}GB (${instance.pricePerHour.toFixed(3)}/hr)
                        </MenuItem>
                      )),
                    ])}
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
                          <TableCell>{getSelectedInstanceDetails().type}</TableCell>
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
                          <TableCell><strong>Architecture:</strong></TableCell>
                          <TableCell>{getSelectedInstanceDetails().arch}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Hourly Cost:</strong></TableCell>
                          <TableCell>${getSelectedInstanceDetails().pricePerHour.toFixed(3)}/hour</TableCell>
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

      {/* Global Database Configuration */}
      {config.configType === 'global-database' && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Global Database Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Aurora Global Database spans multiple AWS regions for disaster recovery with typically less than 1 second of replication lag.
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Primary Region</InputLabel>
                  <Select
                    value={config.globalPrimaryRegion}
                    onChange={(e) => handleConfigChange('globalPrimaryRegion', e.target.value)}
                    label="Primary Region"
                  >
                    {Object.entries(AURORA_REGIONAL_MULTIPLIERS).map(([key, data]) => (
                      <MenuItem key={key} value={key}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Secondary Regions"
                  type="number"
                  value={config.globalSecondaryRegions}
                  onChange={(e) => handleConfigChange('globalSecondaryRegions', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0, max: 5 }}
                  helperText="Up to 5 secondary regions"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instances per Region"
                  type="number"
                  value={config.provisionedInstanceCount}
                  onChange={(e) => handleConfigChange('provisionedInstanceCount', parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, max: 5 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Replication Traffic (GB/month)"
                  type="number"
                  value={config.globalReplicationGB}
                  onChange={(e) => handleConfigChange('globalReplicationGB', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                  helperText="Cross-region data transfer"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Instance Type</InputLabel>
                  <Select
                    value={config.provisionedInstanceType}
                    onChange={(e) => handleConfigChange('provisionedInstanceType', e.target.value)}
                    label="Instance Type"
                  >
                    {['R6g', 'R5', 'R6i'].map((family) => [
                      <MenuItem key={`header-${family}`} disabled>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                          {family} Family
                        </Typography>
                      </MenuItem>,
                      ...AURORA_INSTANCE_CLASSES.filter((i) => i.family === family).map((instance) => (
                        <MenuItem key={instance.type} value={instance.type}>
                          {instance.type} - {instance.vcpu} vCPU, {instance.memory}GB
                        </MenuItem>
                      )),
                    ])}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Storage Configuration */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Storage Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Storage Size (GB)"
                type="number"
                value={config.storageGB}
                onChange={(e) => handleConfigChange('storageGB', parseInt(e.target.value) || 10)}
                inputProps={{ min: 10, max: 128000 }}
                helperText="Aurora storage auto-scales (10 GB - 128 TB)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Storage Type</InputLabel>
                <Select
                  value={config.storageType}
                  onChange={(e) => handleConfigChange('storageType', e.target.value)}
                  label="Storage Type"
                >
                  {Object.entries(AURORA_STORAGE).map(([key, storage]) => (
                    <MenuItem key={key} value={key}>
                      <Box>
                        <Typography variant="body1">{storage.label} (${storage.pricePerGBMonth}/GB-month)</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {storage.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {config.storageType === 'standard' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="I/O Requests (millions/month)"
                  type="number"
                  value={config.ioRequestsPerMonth}
                  onChange={(e) => handleConfigChange('ioRequestsPerMonth', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                  helperText="$0.20 per million I/O requests. Consider I/O-Optimized if >50M requests/month"
                />
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Backup and Advanced Features */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Backup & Advanced Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Backup Storage (GB)"
                type="number"
                value={config.backupStorageGB}
                onChange={(e) => handleConfigChange('backupStorageGB', parseInt(e.target.value) || 0)}
                inputProps={{ min: 0 }}
                helperText="$0.021/GB-month for backups beyond retention"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.enableBacktrack}
                    onChange={(e) => handleConfigChange('enableBacktrack', e.target.checked)}
                  />
                }
                label="Enable Backtrack (MySQL only)"
              />
              {config.enableBacktrack && (
                <TextField
                  fullWidth
                  label="Change Records (millions)"
                  type="number"
                  value={config.backtrackChangeRecords}
                  onChange={(e) => handleConfigChange('backtrackChangeRecords', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                  helperText="$0.012 per million change records stored"
                  sx={{ mt: 2 }}
                />
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

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
                        {costData.configuration.compatibility} | {costData.configuration.region}
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

export default AuroraConfigForm;
