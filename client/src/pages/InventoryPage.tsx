import { useEffect, useState, useCallback } from 'react';
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
  CardActions,
  Chip,
  Tooltip,
  CircularProgress,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { carsApi, type Car } from '../services/api';
import CarFormModal from '../components/CarFormModal';

function InventoryPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchCars = useCallback(() => {
    setLoading(true);
    carsApi
      .getAll()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCars();
  }, [navigate, fetchCars]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ─── CRUD Handlers ────────────────────────────────────────────

  const handleOpenAdd = () => {
    setEditingCar(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCar(null);
  };

  const handleFormSubmit = async (data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCar) {
      await carsApi.update(editingCar.id, data);
      setSnackbar({ open: true, message: 'Car updated successfully', severity: 'success' });
    } else {
      await carsApi.create(data);
      setSnackbar({ open: true, message: 'Car added successfully', severity: 'success' });
    }
    fetchCars();
  };

  const handleDelete = async (car: Car) => {
    if (!window.confirm(`Delete ${car.year} ${car.make} ${car.model}?`)) return;

    try {
      await carsApi.delete(car.id);
      setSnackbar({ open: true, message: 'Car deleted', severity: 'success' });
      fetchCars();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete car', severity: 'error' });
    }
  };

  // ─── Status Chip ──────────────────────────────────────────────

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
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
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
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 24px rgba(108, 99, 255, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1 }}>
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

                  {/* Action Buttons */}
                  <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(car)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main', bgcolor: 'rgba(108, 99, 255, 0.08)' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(car)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main', bgcolor: 'rgba(255, 77, 106, 0.08)' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="Add car"
        onClick={handleOpenAdd}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(135deg, #6c63ff 0%, #5a52d9 100%)',
          boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7f78ff 0%, #6c63ff 100%)',
            boxShadow: '0 6px 28px rgba(108, 99, 255, 0.5)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <AddIcon />
      </Fab>

      {/* Car Form Modal */}
      <CarFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        car={editingCar}
      />

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default InventoryPage;
