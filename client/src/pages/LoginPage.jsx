import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { RecordContext } from "../context/RecordContext";
import CustomInput from "../components/CustomInput";
import "../styles/style.css";

import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        해남브로 & 辛
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const LoginPage = () => {
  const { setName } = useContext(RecordContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3 || password.length < 6)
        throw new Error("입력하신 정보가 올바르지 않습니다.");
      await axios
        .patch("/user/login", { username, password })
        .then(({ data }) => {
          setName(data.name);
          history.push("/");
        });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#fff176" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            className="css-blue"
            style={{ fontWeight: 700 }}
          >
            로그인
          </Typography>
          <Box
            component="form"
            onSubmit={loginHandler}
            noValidate
            sx={{ mt: 1 }}
          >
            <CustomInput
              label="회원ID"
              value={username}
              setValue={setUsername}
              autoFocus
            />
            <CustomInput
              label="비밀번호"
              value={password}
              setValue={setPassword}
              type="password"
            />
            <Button
              className="css-blue bg-yellow"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
