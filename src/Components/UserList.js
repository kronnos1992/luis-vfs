import React, { useState, useEffect } from 'react';
import { db } from '../Data/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Grid, CircularProgress, Avatar, Paper, Typography, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const UserList = ({ onSelect, compact }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        let usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Função para converter a string da data no formato DD/MM/YYYY para uma data válida
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split('/');
          return new Date(`${year}-${month}-${day}`);
        };

        // Ordena pela data de registro e por appointmentConfirmed
        usersList = usersList.sort((a, b) => {
          const dateA = parseDate(a.registrationDate);
          const dateB = parseDate(b.registrationDate);

          // Se ambas as datas são iguais, verifica appointmentConfirmed
          if (dateA.getTime() === dateB.getTime()) {
            return a.appointmentConfirmed === b.appointmentConfirmed ? 0 : a.appointmentConfirmed ? 1 : -1;
          }

          // Caso contrário, ordena pela data
          return dateA - dateB;
        });

        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Paginação
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  if (compact) {
    return (
      <Grid container direction="column" alignItems="center" spacing={1} sx={{ marginRight: "1rem" }}>
        {currentUsers.filter(user => !user.appointmentConfirmed).map((user) => (
          <Grid item key={user.id} onClick={() => onSelect(user)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 45, height: 45 }}>
              {getInitials(user.firstName, user.lastName)}
            </Avatar>
          </Grid>
        ))}
        <Grid item>
          <Button disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</Button>
          <Button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {currentUsers.map((user) => (
        <Grid item key={user.id} xs={12}>
          <Paper style={{ padding: '5px', cursor: 'pointer' }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2">Email: {user.email}</Typography>
                <Typography variant="body2">Phone: {user.phone}</Typography>
                <Typography variant="body2">
                  Confirmed: {String(user.appointmentConfirmed)}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => onSelect(user)}>
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</Button>
        <Button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</Button>
      </Grid>
    </Grid>
  );
};

export default UserList;
