import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Chip,
  Tooltip,
  CircularProgress,
  Fab,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  InputAdornment,
  Divider,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import InventoryIcon from '@mui/icons-material/Inventory';
import { carsApi, type Car } from '../services/api';
import CarFormModal from '../components/CarFormModal';

// ─── Design tokens from DESIGN.md ──────────────────────────────
const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  available: { text: '#00e5ff', bg: 'rgba(0, 229, 255, 0.10)' },
  pending:   { text: '#bb86fc', bg: 'rgba(187, 134, 252, 0.10)' },
  sold:      { text: '#64748b', bg: 'rgba(100, 116, 139, 0.10)' },
};

const GLASS = {
  bg:     'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
  blur:   'blur(12px)',
};

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
];

// ─── Status Badge (DESIGN.md spec) ──────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || { text: '#849396', bg: 'rgba(132, 147, 150, 0.10)' };
  return (
    <Chip
      label={status}
      size="small"
      variant="filled"
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        border: 'none',
        height: 28,
      }}
    />
  );
}

// ─── Vehicle Card ───────────────────────────────────────────────
function VehicleCard({
  car,
  onEdit,
  onDelete,
}: {
  car: Car;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(2, 6, 23, 0.35)',
        p: 0,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(0, 229, 255, 0.30)',
          boxShadow: '0 12px 36px rgba(0, 229, 255, 0.08)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {/* Card Body */}
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Top row: Year + Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: 'text.secondary',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {car.year}
          </Typography>
          <StatusBadge status={car.status} />
        </Box>

        {/* Make — large display, tight tracking */}
        <Typography
          sx={{
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            color: 'text.primary',
            mb: 0.25,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {car.make}
        </Typography>

        {/* Model — lighter secondary */}
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 400,
            color: 'text.secondary',
            mb: 2.5,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {car.model}
        </Typography>

        {/* Data grid: Price + Mileage */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Price */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <AttachMoneyIcon sx={{ fontSize: 14, color: '#00e5ff', opacity: 0.7 }} />
              <Typography sx={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#849396', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                Price
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#00e5ff',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ${car.price.toLocaleString()}
            </Typography>
          </Box>

          {/* Mileage */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <SpeedIcon sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.5 }} />
              <Typography sx={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#849396', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                Mileage
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '0.02em',
                lineHeight: 1.2,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {car.mileage.toLocaleString()}
              <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 0.5, fontFamily: 'Inter, sans-serif' }}>mi</Typography>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Card Footer — actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 0.5,
          px: 2,
          py: 1.5,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            onClick={onEdit}
            sx={{
              color: 'rgba(255, 255, 255, 0.40)',
              '&:hover': { color: '#00e5ff', bgcolor: 'rgba(0, 229, 255, 0.08)' },
              transition: 'all 0.15s ease',
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" arrow>
          <IconButton
            size="small"
            onClick={onDelete}
            sx={{
              color: 'rgba(255, 255, 255, 0.40)',
              '&:hover': { color: '#ffb4ab', bgcolor: 'rgba(255, 180, 171, 0.08)' },
              transition: 'all 0.15s ease',
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ─── Main Page ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

function InventoryPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Derived filtered cars
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        car.make.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === 'All' || car.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cars, searchTerm, statusFilter]);

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

  // ─── Stats for header ────────────────────────────────────────
  const availableCount = cars.filter((c) => c.status === 'available').length;
  const totalValue = cars.reduce((sum, c) => sum + c.price, 0);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0b1326' }}>

      {/* ── Top Navigation Bar ────────────────────────────────── */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 56, md: 64 } }}>
          <DirectionsCarIcon sx={{ mr: 1.5, color: '#00e5ff', fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              background: 'linear-gradient(135deg, #00e5ff, #bb86fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AutoVault
          </Typography>

          {/* Quick stats in header */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, mr: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase', lineHeight: 1 }}>
                Vehicles
              </Typography>
              <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' }}>
                {cars.length}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 0.5 }} />
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase', lineHeight: 1 }}>
                Available
              </Typography>
              <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#00e5ff', letterSpacing: '-0.02em' }}>
                {availableCount}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 0.5 }} />
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase', lineHeight: 1 }}>
                Total Value
              </Typography>
              <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' }}>
                ${totalValue.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Logout" arrow>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: 'rgba(255,255,255,0.45)',
                '&:hover': { color: '#ffb4ab', bgcolor: 'rgba(255, 180, 171, 0.08)' },
              }}
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* ── Main Content Area ─────────────────────────────────── */}
      <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1400, width: '100%', mx: 'auto' }}>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 16 }}>
            <CircularProgress size={40} sx={{ color: '#00e5ff', mb: 2 }} />
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', letterSpacing: '0.04em' }}>
              Loading inventory...
            </Typography>
          </Box>
        ) : cars.length === 0 ? (
          /* ── Empty State ────────────────────────────────────── */
          <Box sx={{ textAlign: 'center', mt: 14 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '16px',
                backgroundColor: GLASS.bg,
                border: GLASS.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <InventoryIcon sx={{ fontSize: 36, color: 'rgba(255,255,255,0.2)' }} />
            </Box>
            <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 1 }}>
              No vehicles in inventory
            </Typography>
            <Typography sx={{ fontSize: '14px', color: 'text.secondary', mb: 4, maxWidth: 320, mx: 'auto' }}>
              Your fleet dashboard is empty. Add your first vehicle to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              size="large"
            >
              Add Vehicle
            </Button>
          </Box>
        ) : (
          <>
            {/* ── Control Bar ────────────────────────────────── */}
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                mb: 3,
                p: 1.5,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' },
                backgroundColor: GLASS.bg,
                backdropFilter: GLASS.blur,
                border: GLASS.border,
                borderRadius: '8px',
              }}
            >
              <TextField
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.06)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                inputProps={{ 'aria-label': 'Search cars' }}
              />

              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.06)', display: { xs: 'none', sm: 'block' } }} />

              <TextField
                select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
                label="Status"
                sx={{
                  minWidth: 170,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.06)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TuneIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Result count */}
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  px: 1,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {filteredCars.length} of {cars.length}
              </Typography>
            </Box>

            {/* ── Vehicle Grid or No-Match ────────────────────── */}
            {filteredCars.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 10 }}>
                <SearchIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.12)', mb: 2 }} />
                <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
                  No cars found
                </Typography>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  Try adjusting your search or filter criteria.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredCars.map((car) => (
                  <Grid item key={car.id} xs={12} sm={6} md={4}>
                    <VehicleCard
                      car={car}
                      onEdit={() => handleOpenEdit(car)}
                      onDelete={() => handleDelete(car)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>

      {/* ── Floating Action Button ────────────────────────────── */}
      <Fab
        color="primary"
        aria-label="Add car"
        onClick={handleOpenAdd}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          '&:hover': { transform: 'scale(1.05)' },
          transition: 'all 0.2s ease',
        }}
      >
        <AddIcon />
      </Fab>

      {/* ── Car Form Modal ────────────────────────────────────── */}
      <CarFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        car={editingCar}
      />

      {/* ── Snackbar Notifications ────────────────────────────── */}
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
          sx={{ borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default InventoryPage;
