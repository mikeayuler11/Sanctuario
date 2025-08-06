import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Help as HelpIcon,
  Add as AddIcon,
  Message as MessageIcon,
} from '@mui/icons-material';

const ClientInquiries: React.FC = () => {
  const inquiries = [
    {
      id: 1,
      inquiryNumber: 'INQ-2025-0001',
      subject: 'Memorial service scheduling',
      category: 'memorial-service',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2025-01-15',
      lastUpdate: '2025-01-18',
      responses: 3,
    },
    {
      id: 2,
      inquiryNumber: 'INQ-2025-0002',
      subject: 'Payment plan adjustment request',
      category: 'billing',
      status: 'resolved',
      priority: 'high',
      createdAt: '2025-01-10',
      lastUpdate: '2025-01-12',
      responses: 5,
    },
    {
      id: 3,
      inquiryNumber: 'INQ-2025-0003',
      subject: 'Maintenance schedule inquiry',
      category: 'maintenance',
      status: 'open',
      priority: 'low',
      createdAt: '2025-01-08',
      lastUpdate: '2025-01-08',
      responses: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'info';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'memorial-service':
        return 'Memorial Service';
      case 'billing':
        return 'Billing';
      case 'maintenance':
        return 'Maintenance';
      case 'grave-purchase':
        return 'Grave Purchase';
      case 'complaint':
        return 'Complaint';
      default:
        return 'General';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Inquiries
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your support requests
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ textTransform: 'none' }}
        >
          New Inquiry
        </Button>
      </Box>

      {inquiries.length > 0 ? (
        <Grid container spacing={3}>
          {inquiries.map((inquiry) => (
            <Grid item xs={12} key={inquiry.id}>
              <Card sx={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {inquiry.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        #{inquiry.inquiryNumber} • {getCategoryLabel(inquiry.category)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label={inquiry.priority.toUpperCase()} 
                        color={getPriorityColor(inquiry.priority) as any}
                        size="small"
                        variant="outlined"
                      />
                      <Chip 
                        label={inquiry.status.replace('-', ' ').toUpperCase()} 
                        color={getStatusColor(inquiry.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">Created</Typography>
                      <Typography variant="body2">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">Last Update</Typography>
                      <Typography variant="body2">
                        {new Date(inquiry.lastUpdate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">Responses</Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <MessageIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {inquiry.responses}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        fullWidth
                        sx={{ textTransform: 'none' }}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'primary.light' }}>
            <HelpIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            No Inquiries Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You haven't submitted any inquiries yet. If you have questions or need assistance, 
            feel free to create a new inquiry.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Submit Your First Inquiry
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ClientInquiries;