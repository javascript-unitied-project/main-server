import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

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

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const history = useHistory();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3)
        throw new Error("회원ID가 너무 짧아요. 3자 이상으로 해주세요.");
      if (password.length < 6)
        throw new Error("비밀번호가 너무 짧아요. 6자 이상으로 해주세요.");
      if (password !== passwordCheck)
        throw new Error("비밀번호가 다릅니다. 확인해주세요.");
      await axios.post("/user/register", {
        name,
        username,
        password,
      });
      history.push("/");      
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
            회원가입
          </Typography>
          <Box
            component="form"
            onSubmit={submitHandler}
            noValidate
            sx={{ mt: 1 }}
          >
            <CustomInput label="이름" value={name} setValue={setName} />
            <CustomInput
              label="회원ID"
              value={username}
              setValue={setUsername}
            />
            <CustomInput
              label="비밀번호"
              value={password}
              type="password"
              setValue={setPassword}
            />
            <CustomInput
              label="비밀번호확인"
              value={passwordCheck}
              type="password"
              setValue={setPasswordCheck}
            />
            <Button
              className="css-blue bg-yellow"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              회원가입
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;
