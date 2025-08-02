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

export default function DataTablePage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userAPI.getAllUsers,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading user data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">Error loading user data</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Data Table
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Real-time view of all user onboarding data
      </Typography>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>About Me</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Birth Date</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.firstName || user.lastName ? (
                      <Typography variant="body2">
                        {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                      </Typography>
                    ) : (
                      <Chip label="Not provided" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
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
                  <TableCell>
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
                  <TableCell>
                    {user.birthdate ? (
                      new Date(user.birthdate).toLocaleDateString()
                    ) : (
                      <Chip label="Not provided" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {users?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No users have completed onboarding yet.
          </Typography>
        </Box>
      )}
    </Container>
  );
} 