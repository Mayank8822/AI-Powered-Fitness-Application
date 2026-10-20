import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { addActivity } from '../services/api';
import { ACTIVITY_CONFIGS, estimateCalories } from '../utils/activityUtils';

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {},
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.duration) return;

    setLoading(true);
    try {
      const payload = {
        type: activity.type,
        duration: Number(activity.duration),
        caloriesBurned: activity.caloriesBurned
          ? Number(activity.caloriesBurned)
          : estimateCalories(activity.type, activity.duration),
        additionalMetrics: activity.additionalMetrics || {},
      };
      await addActivity(payload);
      if (onActivityAdded) onActivityAdded();
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Log Activity
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={activity.type}
              label="Activity Type"
              onChange={(e) => setActivity({ ...activity, type: e.target.value })}
            >
              {Object.entries(ACTIVITY_CONFIGS).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  {config.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Duration (Minutes)"
            type="number"
            sx={{ mb: 2 }}
            value={activity.duration}
            onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Calories Burned"
            type="number"
            sx={{ mb: 2 }}
            value={activity.caloriesBurned}
            onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddRoundedIcon />}
          >
            {loading ? 'Adding...' : 'Add Activity'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;
