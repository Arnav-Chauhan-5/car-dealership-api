import { useState, useEffect, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { Car } from '../services/api';

interface CarFormData {
  make: string;
  model: string;
  year: number | '';
  price: number | '';
  mileage: number | '';
  status: string;
}

interface CarFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  car?: Car | null; // If provided, we're editing; otherwise creating
}

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
];

const emptyForm: CarFormData = {
  make: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  status: 'available',
};

function CarFormModal({ open, onClose, onSubmit, car }: CarFormModalProps) {
  const [form, setForm] = useState<CarFormData>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(car);

  // Pre-fill form when editing
  useEffect(() => {
    if (car) {
      setForm({
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        status: car.status,
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [car, open]);

  const handleChange = (field: keyof CarFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]:
        field === 'year' || field === 'price' || field === 'mileage'
          ? value === '' ? '' : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!form.make || !form.model || form.year === '' || form.price === '') {
      setError('Make, Model, Year, and Price are required.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        make: form.make,
        model: form.model,
        year: Number(form.year),
        price: Number(form.price),
        mileage: form.mileage === '' ? 0 : Number(form.mileage),
        status: form.status,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundImage: 'none',
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEditing ? 'Edit Car' : 'Add New Car'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Make"
              value={form.make}
              onChange={handleChange('make')}
              required
              fullWidth
              margin="normal"
              placeholder="e.g. Toyota"
            />
            <TextField
              label="Model"
              value={form.model}
              onChange={handleChange('model')}
              required
              fullWidth
              margin="normal"
              placeholder="e.g. Camry"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Year"
              type="number"
              value={form.year}
              onChange={handleChange('year')}
              required
              fullWidth
              margin="normal"
              placeholder="e.g. 2024"
              slotProps={{ htmlInput: { min: 1900, max: 2099 } }}
            />
            <TextField
              label="Price ($)"
              type="number"
              value={form.price}
              onChange={handleChange('price')}
              required
              fullWidth
              margin="normal"
              placeholder="e.g. 28999.99"
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Mileage (mi)"
              type="number"
              value={form.mileage}
              onChange={handleChange('mileage')}
              fullWidth
              margin="normal"
              placeholder="e.g. 15000"
              slotProps={{ htmlInput: { min: 0 } }}
            />
            <TextField
              label="Status"
              select
              value={form.status}
              onChange={handleChange('status')}
              fullWidth
              margin="normal"
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 100,
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Add Car'
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CarFormModal;
