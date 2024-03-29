"use client"

import { Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@emotion/react';
import { signIn } from "next-auth/react"

const Login = () => {

  const theme = useTheme()

  const loginWithGoogle = () => {
    signIn('google', { callbackUrl: '/' })
  };

  const loginWithFacebook = () => {
    signIn('facebook', { callbackUrl: '/' })
  };

  

  return (
    <Stack display={theme.flexBox} direction="row" justifyContent={theme.end} sx={{overflowY: "hidden"}}>
      
      <div className="login-img">
        <img id="hiking-image" src="/hiking.png" alt="hiking" width="100%" style={{objectFit: "cover", height:"100vh" }} /> 
        <img id="logo" src="/logo.png" alt="logo" width="110px" height="70" style={{ position: "absolute", top: "16px", left: '35px' }}/> 
      </div>


    <div className="login-content">
    <img id="logo-mobile-login" src="/logo.png" alt="logo" width="90px" height="58" style={{ position: "absolute", top: "25px", left: '25px' }}/> 
    <Stack display={theme.flexBox} justifyContent={theme.center} alignItems={theme.center} width="100%" backgroundColor="rgba(255,255,255, 0.4)" borderRadius="7px" mb={8} p={3} ml={3} mr={3}>
    <h1 className='login-text'>Log in to Planner</h1>
    {/* <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor:"rgba(255,255,255, 0.5)", padding: "20px", borderRadius:"10px"}}>
    <TextField label="Email" name="email" sx={{marginBottom: "15px", background: "white", width: "280px", borderRadius: "7px"}} />
    <TextField label="Password" name='password' sx={{marginBottom: "15px", background: "white", width: "280px", borderRadius: "7px"}} />
    <button class="login-button-regular">Log in</button> */}

    <button className='login-button' onClick={loginWithGoogle}> <Stack width="220px" margin="0 auto" display={theme.flexBox} direction="row" alignItems={theme.center}><img src="/google.png" width="23px" style={{marginRight: "15px"}} alt="google" />Continue with Google </Stack></button>
    <button className='login-button' onClick={loginWithFacebook}> <Stack width="220px" margin="0 auto" display={theme.flexBox} direction="row" alignItems={theme.center}><img src="/facebook.png" width="20px" style={{marginRight: "15px"}} alt="google" />Continue with Facebook </Stack></button>

    {/* </form> */}

    </Stack>
      </div>
    </Stack>
  )
}

export default Login

