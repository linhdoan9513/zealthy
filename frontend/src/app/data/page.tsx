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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/services/api';
import { User } from '@/types';
import styles from './data.module.css';

export default function DataTablePage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userAPI.getAllUsers,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

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
      <Typography variant="h4" component="h1" className={styles.title}>
        User Data Table
      </Typography>

      <Paper elevation={0} className={styles.tableContainer}>
        <TableContainer>
          <Table className={styles.table}>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell className={styles.tableHeadCell}>Name</TableCell>
                <TableCell className={styles.tableHeadCell}>Email</TableCell>
                <TableCell className={styles.tableHeadCell}>About Me</TableCell>
                <TableCell className={styles.tableHeadCell}>Address</TableCell>
                <TableCell className={styles.tableHeadCell}>Birth Date</TableCell>
                <TableCell className={styles.tableHeadCell}>Created</TableCell>
                <TableCell className={styles.tableHeadCell}>Updated</TableCell>
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