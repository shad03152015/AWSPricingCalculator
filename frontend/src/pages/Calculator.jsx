import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { loadAvailableServices, addService } from '../store/slices/calculatorSlice';
import { createEstimate } from '../store/slices/estimatesSlice';
import EC2ConfigForm from '../components/services/EC2ConfigForm';
import S3ConfigForm from '../components/services/S3ConfigForm';
import RDSConfigForm from '../components/services/RDSConfigForm';
import ECSConfigForm from '../components/services/ECSConfigForm';
import LambdaConfigForm from '../components/services/LambdaConfigForm';
import EKSConfigForm from '../components/services/EKSConfigForm';
import AuroraConfigForm from '../components/services/AuroraConfigForm';
import CloudFrontConfigForm from '../components/services/CloudFrontConfigForm';
import Route53ConfigForm from '../components/services/Route53ConfigForm';
import APIGatewayConfigForm from '../components/services/APIGatewayConfigForm';
import SNSConfigForm from '../components/services/SNSConfigForm';
import SQSConfigForm from '../components/services/SQSConfigForm';
import ElastiCacheConfigForm from '../components/services/ElastiCacheConfigForm';
import DynamoDBConfigForm from '../components/services/DynamoDBConfigForm';
import DocumentDBConfigForm from '../components/services/DocumentDBConfigForm';
import NeptuneConfigForm from '../components/services/NeptuneConfigForm';
import RedshiftConfigForm from '../components/services/RedshiftConfigForm';
import KinesisConfigForm from '../components/services/KinesisConfigForm';
import EMRConfigForm from '../components/services/EMRConfigForm';
import GlueConfigForm from '../components/services/GlueConfigForm';
import AthenaConfigForm from '../components/services/AthenaConfigForm';
import StepFunctionsConfigForm from '../components/services/StepFunctionsConfigForm';
import EventBridgeConfigForm from '../components/services/EventBridgeConfigForm';
import CloudWatchConfigForm from '../components/services/CloudWatchConfigForm';
import SystemsManagerConfigForm from '../components/services/SystemsManagerConfigForm';
import SecretsManagerConfigForm from '../components/services/SecretsManagerConfigForm';
import WAFConfigForm from '../components/services/WAFConfigForm';
import CostSummaryCard from '../components/CostSummaryCard';

function Calculator() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const { availableServices, services, totalMonthlyCost } = useSelector((state) => state.calculator);

  // State for dialogs
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [estimateName, setEstimateName] = useState('');
  const [estimateDescription, setEstimateDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // State for configured services
  const [configuredServices, setConfiguredServices] = useState([]);

  // State for tracking if we're editing an estimate
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEstimateId, setEditingEstimateId] = useState(null);

  useEffect(() => {
    dispatch(loadAvailableServices());
  }, [dispatch]);

  // Load estimate data when editing
  useEffect(() => {
    if (location.state?.estimate) {
      const estimate = location.state.estimate;

      // Set editing mode
      setIsEditMode(true);
      setEditingEstimateId(estimate._id);
      setEstimateName(estimate.name);
      setEstimateDescription(estimate.description || '');

      // Load services from estimate
      const loadedServices = estimate.services.map((service, index) => ({
        id: Date.now() + index, // Generate unique IDs
        type: service.serviceCode,
        data: {
          ...service.configuration,
          monthlyCost: service.monthlyCost,
          region: service.region,
        },
      }));

      setConfiguredServices(loadedServices);

      enqueueSnackbar(`Editing estimate: ${estimate.name}`, { variant: 'info' });
    }
  }, [location.state, enqueueSnackbar]);

  // Handle adding EC2 service
  const handleAddEC2 = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'EC2', data: null },
    ]);
    enqueueSnackbar('EC2 service added to calculator', { variant: 'success' });
  };

  // Handle adding S3 service
  const handleAddS3 = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'S3', data: null },
    ]);
    enqueueSnackbar('S3 service added to calculator', { variant: 'success' });
  };

  // Handle adding RDS service
  const handleAddRDS = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'RDS', data: null },
    ]);
    enqueueSnackbar('RDS service added to calculator', { variant: 'success' });
  };

  // Handle adding ECS service
  const handleAddECS = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'ECS', data: null },
    ]);
    enqueueSnackbar('ECS service added to calculator', { variant: 'success' });
  };

  // Handle adding Lambda service
  const handleAddLambda = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'Lambda', data: null },
    ]);
    enqueueSnackbar('Lambda service added to calculator', { variant: 'success' });
  };

  // Handle adding EKS service
  const handleAddEKS = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'EKS', data: null },
    ]);
    enqueueSnackbar('EKS service added to calculator', { variant: 'success' });
  };

  // Handle adding Aurora service
  const handleAddAurora = () => {
    setConfiguredServices((prev) => [
      ...prev,
      { id: Date.now(), type: 'Aurora', data: null },
    ]);
    enqueueSnackbar('Aurora service added to calculator', { variant: 'success' });
  };

  // Handle adding CloudFront service
  const handleAddCloudFront = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'CloudFront', data: null }]);
    enqueueSnackbar('CloudFront service added to calculator', { variant: 'success' });
  };

  // Handle adding Route53 service
  const handleAddRoute53 = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'Route53', data: null }]);
    enqueueSnackbar('Route 53 service added to calculator', { variant: 'success' });
  };

  // Handle adding API Gateway service
  const handleAddAPIGateway = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'APIGateway', data: null }]);
    enqueueSnackbar('API Gateway service added to calculator', { variant: 'success' });
  };

  // Handle adding SNS service
  const handleAddSNS = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'SNS', data: null }]);
    enqueueSnackbar('SNS service added to calculator', { variant: 'success' });
  };

  // Handle adding SQS service
  const handleAddSQS = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'SQS', data: null }]);
    enqueueSnackbar('SQS service added to calculator', { variant: 'success' });
  };

  // Handle adding ElastiCache service
  const handleAddElastiCache = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'ElastiCache', data: null }]);
    enqueueSnackbar('ElastiCache service added to calculator', { variant: 'success' });
  };

  // Handle adding DynamoDB service
  const handleAddDynamoDB = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'DynamoDB', data: null }]);
    enqueueSnackbar('DynamoDB service added to calculator', { variant: 'success' });
  };

  // Handle adding DocumentDB service
  const handleAddDocumentDB = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'DocumentDB', data: null }]);
    enqueueSnackbar('DocumentDB service added to calculator', { variant: 'success' });
  };

  // Handle adding Neptune service
  const handleAddNeptune = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'Neptune', data: null }]);
    enqueueSnackbar('Neptune service added to calculator', { variant: 'success' });
  };

  // Handle adding Redshift service
  const handleAddRedshift = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'Redshift', data: null }]);
    enqueueSnackbar('Redshift service added to calculator', { variant: 'success' });
  };

  // Handle adding Kinesis service
  const handleAddKinesis = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'Kinesis', data: null }]);
    enqueueSnackbar('Kinesis service added to calculator', { variant: 'success' });
  };

  // Handle adding EMR service
  const handleAddEMR = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'EMR', data: null }]);
    enqueueSnackbar('EMR service added to calculator', { variant: 'success' });
  };

  // Handle adding Glue service
  const handleAddGlue = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'Glue', data: null }]);
    enqueueSnackbar('Glue service added to calculator', { variant: 'success' });
  };

  // Handle adding Athena service
  const handleAddAthena = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'Athena', data: null }]);
    enqueueSnackbar('Athena service added to calculator', { variant: 'success' });
  };

  // Handle adding StepFunctions service
  const handleAddStepFunctions = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'StepFunctions', data: null }]);
    enqueueSnackbar('Step Functions service added to calculator', { variant: 'success' });
  };

  // Handle adding EventBridge service
  const handleAddEventBridge = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'EventBridge', data: null }]);
    enqueueSnackbar('EventBridge service added to calculator', { variant: 'success' });
  };

  // Handle adding CloudWatch service
  const handleAddCloudWatch = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'CloudWatch', data: null }]);
    enqueueSnackbar('CloudWatch service added to calculator', { variant: 'success' });
  };

  // Handle adding SystemsManager service
  const handleAddSystemsManager = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'SystemsManager', data: null }]);
    enqueueSnackbar('Systems Manager service added to calculator', { variant: 'success' });
  };

  // Handle adding SecretsManager service
  const handleAddSecretsManager = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'SecretsManager', data: null }]);
    enqueueSnackbar('Secrets Manager service added to calculator', { variant: 'success' });
  };

  // Handle adding WAF service
  const handleAddWAF = () => {
    setConfiguredServices((prev) => [...prev, { id: Date.now(), type: 'WAF', data: null }]);
    enqueueSnackbar('WAF service added to calculator', { variant: 'success' });
  };

  // Handle removing service
  const handleRemoveService = (serviceId) => {
    setConfiguredServices((prev) => prev.filter((s) => s.id !== serviceId));
    enqueueSnackbar('Service removed from calculator', { variant: 'info' });
  };

  // Handle cost update from service configuration
  const handleCostUpdate = (serviceId, costData) => {
    setConfiguredServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, data: costData } : s))
    );
  };

  // Calculate total cost from configured services
  const calculatedTotal = configuredServices.reduce(
    (sum, service) => sum + (service.data?.monthlyCost || 0),
    0
  );

  // Handle save estimate
  const handleSaveEstimate = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (isSaving) return; // Prevent duplicate submissions

    try {
      setIsSaving(true);

      // Transform configured services to match backend schema
      const transformedServices = configuredServices
        .filter((s) => s.data)
        .map((s) => {
          const serviceData = s.data;

          // Generate service name mapping
          const serviceNameMap = {
            'EC2': 'Elastic Compute Cloud',
            'S3': 'Simple Storage Service',
            'RDS': 'Relational Database Service',
            'ECS': 'Elastic Container Service',
            'Lambda': 'Lambda Functions',
            'EKS': 'Elastic Kubernetes Service',
            'Aurora': 'Aurora Database',
            'CloudFront': 'CloudFront CDN',
            'Route53': 'Route 53 DNS',
            'APIGateway': 'API Gateway',
            'SNS': 'Simple Notification Service',
            'SQS': 'Simple Queue Service',
            'ElastiCache': 'ElastiCache',
            'DynamoDB': 'DynamoDB',
            'DocumentDB': 'DocumentDB',
            'Neptune': 'Neptune Graph Database',
            'Redshift': 'Redshift Data Warehouse',
            'Kinesis': 'Kinesis Data Streams',
            'EMR': 'Elastic MapReduce',
            'Glue': 'AWS Glue ETL',
            'Athena': 'Athena Query Service',
            'StepFunctions': 'Step Functions',
            'EventBridge': 'EventBridge',
            'CloudWatch': 'CloudWatch Monitoring',
            'SystemsManager': 'Systems Manager',
            'SecretsManager': 'Secrets Manager',
            'WAF': 'Web Application Firewall'
          };

          return {
            id: s.id.toString(),
            serviceCode: s.type,
            serviceName: serviceNameMap[s.type] || s.type,
            region: serviceData.region || 'us-east-1', // Use region from data or default
            configuration: serviceData.configuration || serviceData, // Use configuration field if available, otherwise entire data
            monthlyCost: serviceData.monthlyCost || 0
          };
        });

      // Prepare estimate data
      const estimateData = {
        name: estimateName.trim(),
        description: estimateDescription.trim() || undefined,
        services: transformedServices,
        totalMonthlyCost: calculatedTotal,
      };

      // Validate that we have services
      if (estimateData.services.length === 0) {
        enqueueSnackbar('Please configure at least one service before saving', { variant: 'warning' });
        setIsSaving(false);
        return;
      }

      // Dispatch create estimate action
      await dispatch(createEstimate(estimateData)).unwrap();

      // Success
      enqueueSnackbar('Estimate saved successfully!', { variant: 'success' });
      setSaveDialogOpen(false);
      setEstimateName('');
      setEstimateDescription('');
    } catch (error) {
      console.error('Save estimate error:', error);
      enqueueSnackbar(error || 'Failed to save estimate', { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle share estimate
  const handleShareEstimate = () => {
    // TODO: Implement share functionality
    enqueueSnackbar('Share functionality coming soon!', { variant: 'info' });
  };

  // Handle export estimate
  const handleExportEstimate = () => {
    const exportData = {
      name: 'AWS Cost Estimate',
      timestamp: new Date().toISOString(),
      services: configuredServices.filter((s) => s.data).map((s) => s.data),
      totalMonthlyCost: calculatedTotal,
      totalAnnualCost: calculatedTotal * 12,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aws-estimate-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    enqueueSnackbar('Estimate exported successfully!', { variant: 'success' });
  };

  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all services?')) {
      setConfiguredServices([]);
      enqueueSnackbar('All services cleared', { variant: 'info' });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              AWS Pricing Calculator
            </Typography>
            {isEditMode && (
              <Chip
                label="Editing"
                color="primary"
                size="medium"
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {isEditMode
              ? `Editing estimate: ${estimateName}`
              : 'Configure AWS services and estimate your monthly costs'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column: Service Configuration */}
          <Grid item xs={12} lg={8}>
            {/* Service Selection Panel */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Available Services
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select services to configure and estimate costs. 27 AWS services available across Compute, Storage, Database, Networking, Analytics, and more.
              </Typography>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Compute Services</Typography>
                    <Chip label="4 services" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          borderColor: 'primary.main',
                        },
                        transition: 'all 0.2s',
                      }}
                      onClick={handleAddEC2}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            EC2 - Elastic Compute Cloud
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Virtual servers in the cloud with flexible instance types
                          </Typography>
                          <Box mt={1}>
                            <Chip label="Compute" size="small" sx={{ mr: 1 }} />
                            <Chip label="Available" size="small" color="success" />
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={handleAddEC2}
                        >
                          Add EC2
                        </Button>
                      </Box>
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          borderColor: 'primary.main',
                        },
                        transition: 'all 0.2s',
                      }}
                      onClick={handleAddECS}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            ECS - Elastic Container Service
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Run containerized applications with Fargate or EC2 launch types
                          </Typography>
                          <Box mt={1}>
                            <Chip label="Containers" size="small" sx={{ mr: 1 }} />
                            <Chip label="Available" size="small" color="success" />
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          color="info"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={handleAddECS}
                        >
                          Add ECS
                        </Button>
                      </Box>
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          borderColor: 'primary.main',
                        },
                        transition: 'all 0.2s',
                      }}
                      onClick={handleAddLambda}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Lambda - Serverless Functions
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Run code without provisioning servers - pay only for compute time used
                          </Typography>
                          <Box mt={1}>
                            <Chip label="Serverless" size="small" sx={{ mr: 1 }} />
                            <Chip label="Available" size="small" color="success" />
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          color="warning"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={handleAddLambda}
                        >
                          Add Lambda
                        </Button>
                      </Box>
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          borderColor: 'primary.main',
                        },
                        transition: 'all 0.2s',
                      }}
                      onClick={handleAddEKS}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            EKS - Elastic Kubernetes Service
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Managed Kubernetes clusters with EC2 or Fargate compute options
                          </Typography>
                          <Box mt={1}>
                            <Chip label="Kubernetes" size="small" sx={{ mr: 1 }} />
                            <Chip label="Available" size="small" color="success" />
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={handleAddEKS}
                        >
                          Add EKS
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Storage Services</Typography>
                    <Chip label="1 service" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                      },
                      transition: 'all 0.2s',
                    }}
                    onClick={handleAddS3}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          S3 - Simple Storage Service
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Object storage service with multiple storage classes for cost optimization
                        </Typography>
                        <Box mt={1}>
                          <Chip label="Storage" size="small" sx={{ mr: 1 }} />
                          <Chip label="Available" size="small" color="success" />
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddS3}
                      >
                        Add S3
                      </Button>
                    </Box>
                  </Paper>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Database Services</Typography>
                    <Chip label="2 services" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          borderColor: 'primary.main',
                        },
                        transition: 'all 0.2s',
                      }}
                      onClick={handleAddRDS}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            RDS - Relational Database Service
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Managed relational databases including MySQL, PostgreSQL, SQL Server, and Oracle
                          </Typography>
                          <Box mt={1}>
                            <Chip label="Database" size="small" sx={{ mr: 1 }} />
                            <Chip label="Available" size="small" color="success" />
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={handleAddRDS}
                        >
                          Add RDS
                        </Button>
                      </Box>
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          borderColor: 'primary.main',
                        },
                        transition: 'all 0.2s',
                      }}
                      onClick={handleAddAurora}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Aurora - Cloud-Native Database
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            MySQL and PostgreSQL-compatible with up to 5x performance - Serverless v2 and Global Database
                          </Typography>
                          <Box mt={1}>
                            <Chip label="Database" size="small" sx={{ mr: 1 }} />
                            <Chip label="Cloud-Native" size="small" sx={{ mr: 1 }} />
                            <Chip label="Available" size="small" color="success" />
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: '#FF9900', '&:hover': { bgcolor: '#FF9900', opacity: 0.9 } }}
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={handleAddAurora}
                        >
                          Add Aurora
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">More Database & Caching Services</Typography>
                    <Chip label="5 services" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" onClick={handleAddElastiCache} startIcon={<AddCircleOutlineIcon />}>Add ElastiCache</Button>
                    <Button variant="outlined" onClick={handleAddDynamoDB} startIcon={<AddCircleOutlineIcon />}>Add DynamoDB</Button>
                    <Button variant="outlined" onClick={handleAddDocumentDB} startIcon={<AddCircleOutlineIcon />}>Add DocumentDB</Button>
                    <Button variant="outlined" onClick={handleAddNeptune} startIcon={<AddCircleOutlineIcon />}>Add Neptune</Button>
                    <Button variant="outlined" onClick={handleAddRedshift} startIcon={<AddCircleOutlineIcon />}>Add Redshift</Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Networking & Content Delivery</Typography>
                    <Chip label="3 services" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" onClick={handleAddCloudFront} startIcon={<AddCircleOutlineIcon />}>Add CloudFront (CDN)</Button>
                    <Button variant="outlined" onClick={handleAddRoute53} startIcon={<AddCircleOutlineIcon />}>Add Route 53 (DNS)</Button>
                    <Button variant="outlined" onClick={handleAddAPIGateway} startIcon={<AddCircleOutlineIcon />}>Add API Gateway</Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Application Integration</Typography>
                    <Chip label="4 services" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" onClick={handleAddSNS} startIcon={<AddCircleOutlineIcon />}>Add SNS (Notifications)</Button>
                    <Button variant="outlined" onClick={handleAddSQS} startIcon={<AddCircleOutlineIcon />}>Add SQS (Queues)</Button>
                    <Button variant="outlined" onClick={handleAddEventBridge} startIcon={<AddCircleOutlineIcon />}>Add EventBridge</Button>
                    <Button variant="outlined" onClick={handleAddStepFunctions} startIcon={<AddCircleOutlineIcon />}>Add Step Functions</Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Analytics & Big Data</Typography>
                    <Chip label="4 services" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" onClick={handleAddKinesis} startIcon={<AddCircleOutlineIcon />}>Add Kinesis</Button>
                    <Button variant="outlined" onClick={handleAddEMR} startIcon={<AddCircleOutlineIcon />}>Add EMR</Button>
                    <Button variant="outlined" onClick={handleAddGlue} startIcon={<AddCircleOutlineIcon />}>Add Glue (ETL)</Button>
                    <Button variant="outlined" onClick={handleAddAthena} startIcon={<AddCircleOutlineIcon />}>Add Athena</Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Management & Security</Typography>
                    <Chip label="4 services" size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" onClick={handleAddCloudWatch} startIcon={<AddCircleOutlineIcon />}>Add CloudWatch</Button>
                    <Button variant="outlined" onClick={handleAddSystemsManager} startIcon={<AddCircleOutlineIcon />}>Add Systems Manager</Button>
                    <Button variant="outlined" onClick={handleAddSecretsManager} startIcon={<AddCircleOutlineIcon />}>Add Secrets Manager</Button>
                    <Button variant="outlined" onClick={handleAddWAF} startIcon={<AddCircleOutlineIcon />}>Add WAF</Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Paper>

            {/* Configured Services */}
            {configuredServices.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Configured Services
                </Typography>
                {configuredServices.map((service) => (
                  <Box key={service.id} mb={3}>
                    {service.type === 'EC2' && (
                      <EC2ConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                    {service.type === 'S3' && (
                      <S3ConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                    {service.type === 'RDS' && (
                      <RDSConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                    {service.type === 'ECS' && (
                      <ECSConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                    {service.type === 'Lambda' && (
                      <LambdaConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                    {service.type === 'EKS' && (
                      <EKSConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                    {service.type === 'Aurora' && (
                      <AuroraConfigForm
                        onRemove={() => handleRemoveService(service.id)}
                        onCostUpdate={(data) => handleCostUpdate(service.id, data)}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {configuredServices.length === 0 && (
              <Paper
                elevation={2}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No services configured yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Click "Add EC2", "Add ECS", "Add Lambda", "Add EKS", "Add S3", "Add RDS", or "Add Aurora" above to start configuring your first service
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Right Column: Cost Summary */}
          <Grid item xs={12} lg={4}>
            <CostSummaryCard
              services={configuredServices.filter((s) => s.data).map((s) => s.data)}
              onSave={handleSaveEstimate}
              onShare={handleShareEstimate}
              onExport={handleExportEstimate}
              onClear={handleClearAll}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Save Estimate Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Estimate</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Estimate Name"
              value={estimateName}
              onChange={(e) => setEstimateName(e.target.value)}
              placeholder="e.g., Production Environment"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              value={estimateDescription}
              onChange={(e) => setEstimateDescription(e.target.value)}
              placeholder="Add notes about this estimate..."
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} disabled={isSaving}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveConfirm}
            disabled={!estimateName.trim() || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Estimate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Calculator;
