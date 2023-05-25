import React, { useState } from "react";
import { TextField, Button, Container, Typography, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import mapNotesService from "./Service/mapNotesService";

const theme = createTheme();

const Login = (props: { handleLogin: (arg0: string) => void }) => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // Make an API call to check username and password
      const response = mapNotesService.postLoginDetails(
        data.username,
        data.password
      );

      if ((await response).status === 200) {
        // Successful login
        props.handleLogin(data.username);
      } else {
        // Handle invalid credentials
        alert("Invalid username or password");
      }
    } catch (error) {
      // Handle API error
      console.error(error);
      alert("Invalid username or password");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" sx={{ mb: 3, mt: 4 }}>
          Landmark Result
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                variant="outlined"
                {...register("username", { required: true })}
                error={!!errors.username}
                helperText={errors.username ? "Username is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                {...register("password", { required: true })}
                error={!!errors.password}
                helperText={errors.password ? "Password is required" : ""}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
