import React, { useContext } from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from 'react-oauth2-code-pkce';

const ActivitiesPageHeader = () => {
  const { logOut } = useContext(AuthContext);

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Fitness Tracker
        </Typography>
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={logOut}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default ActivitiesPageHeader
