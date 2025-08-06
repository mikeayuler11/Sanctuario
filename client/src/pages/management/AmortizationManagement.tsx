import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const AmortizationManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Amortization Management
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Payment & Amortization System</Typography>
          <Typography>Payment tracking and amortization management interface will be implemented here.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AmortizationManagement;