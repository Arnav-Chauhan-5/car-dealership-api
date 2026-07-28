import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Card,
  CardContent,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import { carsApi, type Car } from '../services/api';

function InventoryPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    carsApi
      .getAll()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'available':
        return <Chip label="Available" color="success" size="small" variant="outlined" />;
      case 'sold':
        return <Chip label="Sold" color="default" size="small" variant="outlined" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" variant="outlined" />;
      default:
        return <Chip label={status} size="small" variant="outlined" />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* App Bar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <DirectionsCarIcon sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AutoVault Inventory
          </Typography>

          <Chip
            label={`${cars.length} car${cars.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{
              mr: 2,
              bgcolor: 'rgba(108, 99, 255, 0.1)',
              color: 'primary.main',
              fontWeight: 600,
            }}
          />

          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'error.main', bgcolor: 'rgba(255, 77, 106, 0.08)' },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : cars.length === 0 ? (
          /* Empty State */
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <NoCrashIcon sx={{ fontSize: 72, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" gutterBottom>
              No cars in inventory
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add your first car to get started.
            </Typography>
          </Box>
        ) : (
          /* Car Grid */
          <Grid container spacing={3}>
            {cars.map((car) => (
              <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 24px rgba(108, 99, 255, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
                        {car.year} {car.make}
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          {car.model}
                        </Typography>
                      </Typography>
                      {getStatusChip(car.status)}
                    </Box>

                    {/* Details */}
                    <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <LocalOfferIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                            Price
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            ${car.price.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <SpeedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                            Mileage
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {car.mileage.toLocaleString()} mi
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default InventoryPage;
