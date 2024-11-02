import React, { useState, useEffect } from 'react';
import { db } from '../Data/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Snackbar, LinearProgress, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import countries from '../utils/countries';
import genders from '../utils/genders';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const RegisterForm = ({ userData }) => {
  const [formData, setFormData] = useState({
    passportNumber: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    expiryDate: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    appointmentConfirmed: false
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        ...userData,
        birthDate: formatDate(userData.birthDate),
        expiryDate: formatDate(userData.expiryDate),
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedFormData = {
      passportNumber: formData.passportNumber.toUpperCase(),
      firstName: formData.firstName.toUpperCase(),
      lastName: formData.lastName.toUpperCase(),
      birthDate: formatDate(formData.birthDate),
      expiryDate: formatDate(formData.expiryDate),
      gender: formData.gender,
      nationality: formData.nationality.toUpperCase(),
      email: formData.email.toLowerCase(),
      phone: formData.phone.toUpperCase(),
      registrationDate: formatDate(new Date()), // Define a data de registro automaticamente
      appointmentConfirmed: formData.appointmentConfirmed
    };

    try {
      if (userData) {
        const userDoc = doc(db, 'users', userData.id);
        await updateDoc(userDoc, formattedFormData);
      } else {
        await addDoc(collection(db, 'users'), formattedFormData);
      }
      setOpen(true);
      setFormData({
        passportNumber: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        expiryDate: '',
        gender: '',
        nationality: '',
        email: '',
        phone: '',
        appointmentConfirmed: false
      });
    } catch (error) {
      console.error('Erro ao registrar dados: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField name="passportNumber" label="Passport Number" value={formData.passportNumber} onChange={handleChange} fullWidth margin="normal" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} fullWidth margin="normal" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} fullWidth margin="normal" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="birthDate" label="Birth Date" type="date" value={formData.birthDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="expiryDate" label="Expiry Date" type="date" value={formData.expiryDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select name="gender" label="Gender" value={formData.gender} onChange={handleChange}>
              {genders.map((gender) => (
                <MenuItem key={gender.id} value={gender.name}>
                  {gender.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Nationality</InputLabel>
            <Select name="nationality" label="Nationality" value={formData.nationality} onChange={handleChange}>
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.appointmentConfirmed}
                onChange={handleChange}
                name="appointmentConfirmed"
                color="primary"
                disabled={!userData} // Checkbox disabled if no user data (new entry)
              />
            }
            label="Appointment Confirmed"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : userData ? 'Atualizar' : 'Registrar'}
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity="success">
          <LinearProgress />
          {userData ? 'Dados atualizados com sucesso!' : 'Dados registrados com sucesso!'}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default RegisterForm;
