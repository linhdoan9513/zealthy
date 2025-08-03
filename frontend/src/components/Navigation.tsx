'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Onboarding', path: '/' },
    { label: 'Admin', path: '/admin' },
    { label: 'Data', path: '/data' },
  ];

  return (
    <AppBar position="static" className={styles.navigation}>
      <Toolbar className={styles.toolbar}>
        <Typography variant="h6" component="div" className={styles.brand}>
          Zealthy
        </Typography>
        <Box className={styles.navContainer}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} passHref>
              <Button
                color="inherit"
                className={`${styles.navButton} ${pathname === item.path ? styles.active : ''}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 