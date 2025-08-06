import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const ClientGraves: React.FC = () => {
  const graves = [
    {
      id: 1,
      plotNumber: 'A-12',
      section: 'Garden of Peace',
      block: 'A',
      row: '3',
      type: 'Single',
      status: 'Occupied',
      price: 15000,
      deceased: [
        {
          name: 'Maria Santos',
          dateOfBirth: '1945-03-15',
          dateOfDeath: '2020-12-10',
          relation: 'Mother',
        },
      ],
      amortization: {
        totalAmount: 15000,
        paidAmount: 12000,
        remainingAmount: 3000,
        nextPayment: '2025-02-15',
      },
    },
    {
      id: 2,
      plotNumber: 'B-45',
      section: 'Memorial Gardens',
      block: 'B',
      row: '8',
      type: 'Double',
      status: 'Reserved',
      price: 25000,
      deceased: [],
      amortization: {
        totalAmount: 25000,
        paidAmount: 5000,
        remainingAmount: 20000,
        nextPayment: '2025-01-30',
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'occupied':
        return 'success';
      case 'reserved':
        return 'warning';
      case 'available':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Graves
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage and view details of your memorial plots
      </Typography>

      <Grid container spacing={3}>
        {graves.map((grave) => (
          <Grid item xs={12} lg={6} key={grave.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                      Plot {grave.plotNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {grave.section} • {grave.type} Plot
                    </Typography>
                  </Box>
                  <Chip 
                    label={grave.status} 
                    color={getStatusColor(grave.status) as any}
                    variant="filled"
                  />
                </Box>

                {/* Location Details */}
                <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
                    Location Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Section</Typography>
                      <Typography variant="body2">{grave.section}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Block</Typography>
                      <Typography variant="body2">{grave.block}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Row</Typography>
                      <Typography variant="body2">{grave.row}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Plot</Typography>
                      <Typography variant="body2">{grave.plotNumber}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Deceased Information */}
                {grave.deceased.length > 0 && (
                  <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                      Interred
                    </Typography>
                    {grave.deceased.map((person, index) => (
                      <Box key={index} sx={{ mb: index < grave.deceased.length - 1 ? 2 : 0 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {person.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {person.relation} • {new Date(person.dateOfBirth).toLocaleDateString()} - {new Date(person.dateOfDeath).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                )}

                {/* Payment Information */}
                <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <MoneyIcon sx={{ mr: 1, fontSize: 16 }} />
                    Payment Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        ${grave.amortization.totalAmount.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Paid Amount</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        ${grave.amortization.paidAmount.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Remaining</Typography>
                      <Typography variant="body2" fontWeight="medium" color="warning.main">
                        ${grave.amortization.remainingAmount.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Next Payment</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(grave.amortization.nextPayment).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="outlined" size="small">
                    View Details
                  </Button>
                  <Button variant="outlined" size="small">
                    Make Payment
                  </Button>
                  <Button variant="outlined" size="small">
                    Schedule Service
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {graves.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
          <LocationIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Graves Found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You don't have any graves registered to your account yet.
          </Typography>
          <Button variant="contained">
            Contact Us to Purchase
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ClientGraves;