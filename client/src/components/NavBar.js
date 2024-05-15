import { AppBar, Box, SvgIcon, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { ReactComponent as Logo } from '../static/castleFilled.svg';
import { amber } from "@mui/material/colors";
import { useEffect, useState } from "react";

function NavText({ href, text, isMain, color = 'inherit' }) {
  return (
    <Typography
      variant={'h3'}
      noWrap
      sx={{
        fontFamily: 'Mouse Memoirs',
        fontWeight: 700,
        fontSize: {xs: '28pt', lg:'40pt'},
        letterSpacing: '.2rem',
        mr:'60px',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: `${color}`,
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

export default function NavBar() {
  const [scrollBackground, setScrollBackground] = useState('transparent');

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const background = scrollPosition > 64 ? amber[300] : 'transparent';
    setScrollBackground(background);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AppBar
      id='navbar'
      position='fixed'
      sx={{
        backgroundColor: scrollBackground,
        transition: 'background-color 0.3s ease',
        boxShadow: `0px 2px 4px rgba(0, 0, 0, ${scrollBackground === 'transparent' ? 0 : 0.5})`,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: '64px' }}>
        <SvgIcon component={Logo} viewBox="0 0 900 900" sx={{fill: "white", fontSize: "80px", stroke:"white",}} />
        <NavText href='/' text='DISNEY WORLD PLANNER' color="white" />
        <Box/>
      </Toolbar>
    </AppBar>
  );
}
