/* eslint-disable no-undef */
import React, { useState } from 'react';
import RegisterForm from './Components/RegisterForm';
import UserList from './Components/UserList';
import { AppBar, Toolbar, Typography, Container, Drawer, IconButton, Box, Grid, Card, CardContent } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  const fillVisaForm = (user) => {
    if (user) {
      const currentDomain = window.location.hostname;

      if (currentDomain.includes('row7.vfsglobal.com')) {
        const getElementByXPath = (path) => {
          const result = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          return result.singleNodeValue;
        };

        getElementByXPath('//*[@id="PassportNumber"]').value = user.passportNumber || '';
        getElementByXPath('//*[@id="DateOfBirth"]').value = user.birthDate || '';
        getElementByXPath('//*[@id="PassportExpiryDate"]').value = user.expiryDate || '';
        getElementByXPath('//*[@id="NationalityId"]').value = user.nationality || '';
        getElementByXPath('//*[@id="FirstName"]').value = user.firstName || '';
        getElementByXPath('//*[@id="LastName"]').value = user.lastName || '';
        getElementByXPath('//*[@id="GenderId"]').value = user.gender || '';
        getElementByXPath('//*[@id="Mobile"]').value = user.phone || '';
        getElementByXPath('//*[@id="validateEmailId"]').value = user.email || '';

        const form = getElementByXPath('//form');
        if (form) {
          form.submit();
          console.log('Formulário submetido.');
        } else {
          console.log('Formulário não encontrado.');
        }
      } else {
        console.log('O site atual não é suportado para preenchimento automático.');
      }
    } else {
      console.log('Nenhum usuário encontrado para preencher o formulário.');
    }
  };
  
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleFillForm = (user) => {
    fillVisaForm(user);
  };
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

 return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ textAlign: "center" }} variant="h6">JULYA.BOT VFS</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" align="center" gutterBottom>
                  Registro de Dados
                </Typography>
                <RegisterForm userData={selectedUser} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                  Usuários Registrados
                </Typography>
                <UserList onSelect={handleSelectUser} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Drawer
          anchor="right"
          open={open}
          onClose={toggleDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              width: 30, // Ajuste a largura do Drawer
              maxHeight: '50%', // Altura para acomodar aproximadamente 5 usuários
              overflowY: 'auto',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '30px', // Arredondar mais o contorno do Drawer
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparência aumentada
              position: 'fixed', // Fixa a posição do Drawer
              top: '35%', // Alinha o Drawer com o botão flutuante
              right: 15, // Alinha o Drawer com o botão flutuante
              zIndex: 1300, // Garante que o Drawer apareça sobre o botão flutuante
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <UserList onSelect={handleFillForm} compact />
          </Box>
        </Drawer>
        <IconButton
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(63, 81, 181, 0.7)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(63, 81, 181, 0.9)',
            },
          }}
          onClick={toggleDrawer}
        >
          <AssignmentTurnedInIcon />
        </IconButton>
      </Container>
    </div>
  );
}
export default App;
