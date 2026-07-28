import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Divider,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { authApi, ApiError } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const action = isRegister ? authApi.register : authApi.login;
      const data = await action(email, password);
      localStorage.setItem('token', data.token);
      navigate('/inventory');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #1a1d2e 0%, #0f1117 70%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            maxWidth: 440,
            mx: 'auto',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Logo Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6c63ff 0%, #00d4aa 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)',
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 32, color: '#fff' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AutoVault
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Car Dealership Management
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Form Title */}
            <Typography variant="h5" align="center" sx={{ mb: 3 }}>
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@dealership.com"
                required
                fullWidth
                margin="normal"
                autoComplete="email"
                autoFocus
              />

              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                fullWidth
                margin="normal"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #6c63ff 0%, #5a52d9 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7f78ff 0%, #6c63ff 100%)',
                    boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isRegister ? (
                  'Sign Up'
                ) : (
                  'Sign In'
                )}
              </Button>

              <Typography variant="body2" align="center" color="text.secondary">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                  }}
                  sx={{ fontWeight: 600 }}
                >
                  {isRegister ? 'Sign In' : 'Sign Up'}
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;
