'use client';

import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Refresh } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/services/api';
import { User } from '@/types';
import styles from './data.module.css';
import { useState } from 'react';

export default function DataTablePage() {
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users', sortBy, sortOrder],
    queryFn: () => userAPI.getAllUsers(sortBy, sortOrder),
    refetchOnWindowFocus: true,  // Refresh when user returns to tab
    staleTime: 30000,           // Consider data fresh for 30 seconds
    gcTime: 300000,             // Keep in cache for 5 minutes
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default desc order
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
    }
    // Show neutral arrow for unsorted columns
    return <ArrowUpward style={{ opacity: 0.3 }} />;
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" className={styles.container}>
        <Typography>Loading user data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className={styles.container}>
        <Typography color="error">Error loading user data</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" className={styles.title}>
          User Data Table
        </Typography>
        <Button
          variant="outlined"
          startIcon={isLoading ? <CircularProgress size={20} /> : <Refresh />}
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      <Paper elevation={0} className={styles.tableContainer}>
        <TableContainer>
          <Table className={styles.table}>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell className={styles.tableHeadCell}>
                  <Box className={styles.sortableHeader} onClick={() => handleSort('firstName')}>
                    <Typography>Name</Typography>
                    {getSortIcon('firstName')}
                  </Box>
                </TableCell>
                <TableCell className={styles.tableHeadCell}>
                  <Box className={styles.sortableHeader} onClick={() => handleSort('email')}>
                    <Typography>Email</Typography>
                    {getSortIcon('email')}
                  </Box>
                </TableCell>
                <TableCell className={styles.tableHeadCell}>
                  <Typography>About Me</Typography>
                </TableCell>
                <TableCell className={styles.tableHeadCell}>
                  <Typography>Address</Typography>
                </TableCell>
                <TableCell className={styles.tableHeadCell}>
                  <Box className={styles.sortableHeader} onClick={() => handleSort('birthdate')}>
                    <Typography>Birth Date</Typography>
                    {getSortIcon('birthdate')}
                  </Box>
                </TableCell>
                <TableCell className={styles.tableHeadCell}>
                  <Box className={styles.sortableHeader} onClick={() => handleSort('createdAt')}>
                    <Typography>Created</Typography>
                    {getSortIcon('createdAt')}
                  </Box>
                </TableCell>
                <TableCell className={styles.tableHeadCell}>
                  <Box className={styles.sortableHeader} onClick={() => handleSort('updatedAt')}>
                    <Typography>Updated</Typography>
                    {getSortIcon('updatedAt')}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user: User) => (
                <TableRow key={user.id} className={styles.tableRow}>
                  <TableCell className={styles.tableBodyCell}>
                    {user.firstName || user.lastName ? (
                      <Typography variant="body2">
                        {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                      </Typography>
                    ) : (
                      <Chip label="Not provided" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell className={styles.tableBodyCell}>{user.email}</TableCell>
                  <TableCell className={styles.tableBodyCell}>
                    {user.aboutMe ? (
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {user.aboutMe.length > 100
                          ? `${user.aboutMe.substring(0, 100)}...`
                          : user.aboutMe}
                      </Typography>
                    ) : (
                      <Chip label="Not provided" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell className={styles.tableBodyCell}>
                    {user.street || user.city || user.state || user.zip ? (
                      <Box>
                        {user.street && <Typography variant="body2">{user.street}</Typography>}
                        {(user.city || user.state || user.zip) && (
                          <Typography variant="body2" color="text.secondary">
                            {[user.city, user.state, user.zip].filter(Boolean).join(', ')}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Chip label="Not provided" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell className={styles.tableBodyCell}>
                    {user.birthdate ? (
                      new Date(user.birthdate).toLocaleDateString()
                    ) : (
                      <Chip label="Not provided" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell className={styles.tableBodyCell}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={styles.tableBodyCell}>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {users?.length === 0 && (
        <Box className={styles.emptyState}>
          <Typography variant="body1" color="text.secondary">
            No users have completed onboarding yet.
          </Typography>
        </Box>
      )}
    </Container>
  );
} 