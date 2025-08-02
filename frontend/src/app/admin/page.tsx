'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/services/api';
import { OnboardingComponent } from '@/types';

const availableComponents: { value: OnboardingComponent; label: string }[] = [
  { value: 'aboutMe', label: 'About Me' },
  { value: 'address', label: 'Address' },
  { value: 'birthdate', label: 'Birth Date' },
];



export default function AdminPage() {
  const [page2Components, setPage2Components] = useState<OnboardingComponent[]>(['aboutMe']);
  const [page3Components, setPage3Components] = useState<OnboardingComponent[]>(['address']);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['onboardingConfig'],
    queryFn: adminAPI.getOnboardingConfig,
  });

  const updateConfigMutation = useMutation({
    mutationFn: adminAPI.updateOnboardingConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingConfig'] });
    },
  });

  const initializeConfigMutation = useMutation({
    mutationFn: adminAPI.initializeDefaultConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingConfig'] });
      // Reset local state to defaults
      setPage2Components(['aboutMe']);
      setPage3Components(['address']);
      // Show success message for 3 seconds
      setShowResetSuccess(true);
      setTimeout(() => {
        setShowResetSuccess(false);
      }, 3000);
    },
  });

  useEffect(() => {
    if (config) {
      setPage2Components(config.page2.map(c => c.component));
      setPage3Components(config.page3.map(c => c.component));
    }
  }, [config]);

  // Get available components that can be added to each page
  const getAvailableComponentsForPage = (page: number) => {
    const currentPageComponents = page === 2 ? page2Components : page3Components;
    const otherPageComponents = page === 2 ? page3Components : page2Components;
    
    // Return components that are either:
    // 1. Not on any page yet, OR
    // 2. Currently on the other page (so they can be moved)
    return availableComponents.filter(comp => 
      !currentPageComponents.includes(comp.value) && 
      (otherPageComponents.includes(comp.value) || 
       (!page2Components.includes(comp.value) && !page3Components.includes(comp.value)))
    );
  };

  const handleAddComponent = (page: number, component: OnboardingComponent) => {
    if (page === 2) {
      // Add to page 2 and remove from page 3 if it exists there
      setPage2Components([...page2Components, component]);
      setPage3Components(page3Components.filter(c => c !== component));
    } else {
      // Add to page 3 and remove from page 2 if it exists there
      setPage3Components([...page3Components, component]);
      setPage2Components(page2Components.filter(c => c !== component));
    }
  };

  const handleRemoveComponent = (page: number, component: OnboardingComponent) => {
    if (page === 2) {
      // Ensure at least one component remains on page 2
      if (page2Components.length > 1) {
        setPage2Components(page2Components.filter(c => c !== component));
      }
    } else {
      // Ensure at least one component remains on page 3
      if (page3Components.length > 1) {
        setPage3Components(page3Components.filter(c => c !== component));
      }
    }
  };

  // Validation function to check if configuration is valid
  const isConfigurationValid = () => {
    // Each page must have at least one component
    if (page2Components.length === 0 || page3Components.length === 0) {
      return false;
    }
    
    // If each page has exactly one component, consider it valid
    if (page2Components.length === 1 && page3Components.length === 1) {
      return true;
    }
    
    // For other cases, all components must be assigned to at least one page
    const allAssignedComponents = [...page2Components, ...page3Components];
    const uniqueAssignedComponents = new Set(allAssignedComponents);
    
    if (uniqueAssignedComponents.size !== availableComponents.length) {
      return false;
    }
    
    return true;
  };

  // Get validation status for better UX
  const getValidationStatus = () => {
    if (page2Components.length === 0) {
      return { valid: false, message: "Page 2 must have at least one component" };
    }
    if (page3Components.length === 0) {
      return { valid: false, message: "Page 3 must have at least one component" };
    }
    
    // If each page has exactly one component, consider it valid
    if (page2Components.length === 1 && page3Components.length === 1) {
      return { valid: true, message: "Configuration is valid" };
    }
    
    const allAssignedComponents = [...page2Components, ...page3Components];
    const uniqueAssignedComponents = new Set(allAssignedComponents);
    
    if (uniqueAssignedComponents.size !== availableComponents.length) {
      return { valid: false, message: "All components must be assigned to a page" };
    }
    
    return { valid: true, message: "Configuration is valid" };
  };

  const handleSave = () => {
    if (!isConfigurationValid()) {
      return;
    }

    // Save page 2 configuration
    updateConfigMutation.mutate({
      page: 2,
      components: page2Components.map((component, index) => ({
        component,
        order: index,
      })),
    });

    // Save page 3 configuration
    updateConfigMutation.mutate({
      page: 3,
      components: page3Components.map((component, index) => ({
        component,
        order: index,
      })),
    });
  };

  const handleInitialize = () => {
    initializeConfigMutation.mutate();
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage the onboarding flow configuration. Each page must have at least one component. 
        Use the + button to add available components or the - button to remove them.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Page 2 Configuration */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Page 2 Components
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Components on the second page of the onboarding flow
            </Typography>

            {/* Current Page 2 Components */}
            <List dense>
              {page2Components.map((component) => (
                <ListItem
                  key={component}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveComponent(2, component)}
                      disabled={page2Components.length <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={availableComponents.find(c => c.value === component)?.label}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Available Components to Add */}
            <Typography variant="subtitle2" gutterBottom>
              Available Components
            </Typography>
            <List dense>
              {getAvailableComponentsForPage(2).map((component) => {
                const isFromOtherPage = page3Components.includes(component.value);
                return (
                  <ListItem
                    key={component.value}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleAddComponent(2, component.value)}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={component.label}
                      secondary={isFromOtherPage ? "Move from Page 3" : "Add new component"}
                    />
                  </ListItem>
                );
              })}
              {getAvailableComponentsForPage(2).length === 0 && (
                <ListItem>
                  <ListItemText 
                    primary="No available components" 
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>

        {/* Page 3 Configuration */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Page 3 Components
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Components on the third page of the onboarding flow
            </Typography>

            {/* Current Page 3 Components */}
            <List dense>
              {page3Components.map((component) => (
                <ListItem
                  key={component}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveComponent(3, component)}
                      disabled={page3Components.length <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={availableComponents.find(c => c.value === component)?.label}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Available Components to Add */}
            <Typography variant="subtitle2" gutterBottom>
              Available Components
            </Typography>
            <List dense>
              {getAvailableComponentsForPage(3).map((component) => {
                const isFromOtherPage = page2Components.includes(component.value);
                return (
                  <ListItem
                    key={component.value}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleAddComponent(3, component.value)}
                      >
                        <AddIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={component.label}
                      secondary={isFromOtherPage ? "Move from Page 2" : "Add new component"}
                    />
                  </ListItem>
                );
              })}
              {getAvailableComponentsForPage(3).length === 0 && (
                <ListItem>
                  <ListItemText 
                    primary="No available components" 
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updateConfigMutation.isPending || !isConfigurationValid()}
        >
          Save Configuration
        </Button>
        <Button
          variant="outlined"
          onClick={handleInitialize}
          disabled={initializeConfigMutation.isPending}
        >
          Reset to Default
        </Button>
      </Box>

      {/* Validation feedback */}
      {!isConfigurationValid() && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.contrastText" variant="body2">
            {getValidationStatus().message}
          </Typography>
        </Box>
      )}

      {isConfigurationValid() && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
          <Typography color="success.contrastText" variant="body2">
            Configuration is valid and ready to save
          </Typography>
        </Box>
      )}

      {updateConfigMutation.isSuccess && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          Configuration saved successfully!
        </Typography>
      )}
      
      {showResetSuccess && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          Configuration reset to defaults successfully!
        </Typography>
      )}
    </Container>
  );
} 