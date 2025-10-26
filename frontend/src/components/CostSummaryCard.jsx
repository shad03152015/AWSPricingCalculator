import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#FF9900', '#232F3E', '#4A90E2', '#00A699', '#FF5A5F', '#767676'];

const CostSummaryCard = ({
  services = [],
  onSave,
  onShare,
  onExport,
  onClear,
}) => {
  // Calculate total costs
  const totalMonthlyCost = services.reduce((sum, service) => sum + (service.monthlyCost || 0), 0);
  const totalAnnualCost = totalMonthlyCost * 12;

  // Prepare data for pie chart
  const chartData = services.map((service, index) => ({
    name: service.serviceName,
    value: service.monthlyCost || 0,
    color: COLORS[index % COLORS.length],
  }));

  // Custom label for pie chart
  const renderCustomLabel = ({ name, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for segments < 5%
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Card
      elevation={4}
      sx={{
        position: { md: 'sticky' },
        top: { md: 16 },
        height: 'fit-content',
      }}
    >
      <CardContent>
        {/* Header */}
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          Cost Summary
        </Typography>

        {/* Total Cost Display */}
        <Box
          sx={{
            p: 3,
            mb: 3,
            bgcolor: 'primary.light',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="subtitle2" color="primary.dark" gutterBottom>
            Estimated Monthly Cost
          </Typography>
          <Typography variant="h3" fontWeight="bold" color="primary.main">
            ${totalMonthlyCost.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Annual: ${totalAnnualCost.toFixed(2)}
          </Typography>
        </Box>

        {/* Service List */}
        {services.length > 0 ? (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Service Breakdown ({services.length} service{services.length !== 1 ? 's' : ''})
            </Typography>
            <List dense sx={{ mb: 2 }}>
              {services.map((service, index) => (
                <ListItem
                  key={index}
                  sx={{
                    px: 0,
                    py: 1,
                    borderBottom: index < services.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: COLORS[index % COLORS.length],
                          }}
                        />
                        <Typography variant="body2" fontWeight="medium">
                          {service.serviceName}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {service.region}
                      </Typography>
                    }
                  />
                  <Typography variant="body2" fontWeight="bold">
                    ${(service.monthlyCost || 0).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Pie Chart */}
            {services.length > 1 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Cost Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Stack spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={onSave}
                size="large"
              >
                Save Estimate
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<ShareIcon />}
                onClick={onShare}
              >
                Share Estimate
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={onExport}
              >
                Export JSON
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<ClearAllIcon />}
                onClick={onClear}
              >
                Clear All
              </Button>
            </Stack>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No services configured yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Add services to see your cost estimate
            </Typography>
          </Box>
        )}

        {/* Cost Insights */}
        {services.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" component="div">
              <strong>Note:</strong> Prices are estimates based on on-demand rates in{' '}
              {services[0]?.region}. Actual costs may vary based on usage, data transfer, and
              regional pricing differences.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CostSummaryCard;
