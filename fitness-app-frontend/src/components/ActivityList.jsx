import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Grid2,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { getActivities, deleteActivity } from '../services/api';

const ActivityList = ({ refreshKey }) => {
  const [activities, setActivities] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refreshKey]);

  const handleDelete = async (e, activityId) => {
    e.stopPropagation(); // keep this isolated from any future card-level click handlers

    const confirmed = window.confirm('Delete this activity? This cannot be undone.');
    if (!confirmed) return;

    // optimistic update: remove immediately, restore if the request fails
    const previousActivities = activities;
    setDeletingId(activityId);
    setActivities((prev) => prev.filter((a) => a.id !== activityId));

    try {
      await deleteActivity(activityId);
      setSnackbar({ open: true, message: 'Activity deleted', severity: 'success' });
    } catch (error) {
      console.error(error);
      setActivities(previousActivities);
      setSnackbar({ open: true, message: 'Failed to delete activity', severity: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewRecommendation = (e, activityId) => {
    e.stopPropagation();
    navigate(`/activities/${activityId}`);
  };

  return (
    <>
      <Grid2 container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ mt: 1 }}>
        {activities.map((activity) => (
          <Grid2 key={activity.id} size={{ xs: 4, sm: 4, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardHeader
                title={activity.type}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <IconButton
                    aria-label="delete activity"
                    onClick={(e) => handleDelete(e, activity.id)}
                    disabled={deletingId === activity.id}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ pb: 0 }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography>Duration: {activity.duration} min</Typography>
                <Typography>Calories: {activity.caloriesBurned}</Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton
                  aria-label="view recommendation"
                  onClick={(e) => handleViewRecommendation(e, activity.id)}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ActivityList
