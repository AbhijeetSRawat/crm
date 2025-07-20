import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Tooltip,
  Stack,
  Paper,
} from '@mui/material';
import {
  CalendarToday,
  Event,
  Add,
  Edit,
  Delete,
  AccessTime,
  Alarm,
  Close,
  ArrowBack,
  ArrowForward,
  Today,
  Schedule,
  Assignment,
  Group,
  CheckCircle,
  ErrorOutline,
} from '@mui/icons-material';

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: 'Follow-up with John Doe',
    type: 'Follow-up',
    date: '2025-07-12',
    time: '10:00',
    description: 'Discuss product demo feedback.',
    color: '#00e6ff',
    reminder: true,
  },
  {
    id: 2,
    title: 'Team Meeting',
    type: 'Meeting',
    date: '2025-07-13',
    time: '15:00',
    description: 'Weekly sales team sync.',
    color: '#2196f3',
    reminder: false,
  },
  {
    id: 3,
    title: 'Deadline: Proposal Submission',
    type: 'Deadline',
    date: '2025-07-15',
    time: '17:00',
    description: 'Submit proposal to Acme Corp.',
    color: '#ff9800',
    reminder: true,
  },
];

const eventTypes = [
  { label: 'Follow-up', color: '#00e6ff' },
  { label: 'Meeting', color: '#2196f3' },
  { label: 'Deadline', color: '#ff9800' },
  { label: 'Other', color: '#9c27b0' },
];

function getEventColor(type) {
  return eventTypes.find(e => e.label === type)?.color || '#666';
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { dateStyle: 'medium' });
}

export default function AgentCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState(mockEvents);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Follow-up',
    date: '',
    time: '',
    description: '',
    reminder: false,
  });
  const [viewEvent, setViewEvent] = useState(null);

  // Calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const handleToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowDialog(true);
    setNewEvent({
      title: '',
      type: 'Follow-up',
      date: dateStr,
      time: '',
      description: '',
      reminder: false,
    });
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents([
      ...events,
      {
        ...newEvent,
        id: Date.now(),
        color: getEventColor(newEvent.type),
      },
    ]);
    setShowDialog(false);
  };

  const eventsForDay = (dateStr) => events.filter(e => e.date === dateStr);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <CalendarToday sx={{ fontSize: 40, color: '#00e6ff' }} />
        <Box>
          <Typography variant="h4" fontWeight={900} color="#00e6ff">
            Calendar Integration
          </Typography>
          <Typography variant="body1" color="textSecondary">
            View follow-ups, meetings, and deadlines
          </Typography>
        </Box>
        <Box flex={1} />
        <Button
          variant="contained"
          startIcon={<Today />}
          onClick={handleToday}
          sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, borderRadius: 2, '&:hover': { background: '#00b3cc' } }}
        >
          Today
        </Button>
      </Box>

      {/* Calendar Controls */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton onClick={handlePrevMonth} sx={{ color: '#00e6ff' }}><ArrowBack /></IconButton>
        <Typography variant="h6" fontWeight={700} color="#00e6ff">
          {today.toLocaleString('en-IN', { month: 'long' })} {currentYear}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ color: '#00e6ff' }}><ArrowForward /></IconButton>
      </Box>

      {/* Calendar Grid */}
      <Card sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, p: 2 }}>
        <Grid container spacing={1}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <Grid item xs={1.71} key={day}>
              <Typography variant="subtitle2" color="#00e6ff" align="center">{day}</Typography>
            </Grid>
          ))}
          {calendarDays.map((day, idx) => {
            const dateStr = day ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
            const dayEvents = day ? eventsForDay(dateStr) : [];
            return (
              <Grid item xs={1.71} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    minHeight: 80,
                    background: day ? '#222' : 'transparent',
                    border: day ? '1px solid #333' : 'none',
                    borderRadius: 2,
                    p: 1,
                    cursor: day ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: day ? '#00e6ff' : 'none' },
                  }}
                  onClick={() => handleDayClick(day)}
                >
                  <Typography variant="subtitle2" color={day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? '#00e6ff' : '#fff'}>
                    {day || ''}
                  </Typography>
                  <Stack direction="column" spacing={0.5} mt={1}>
                    {dayEvents.slice(0, 2).map(ev => (
                      <Chip
                        key={ev.id}
                        label={ev.title.length > 12 ? ev.title.slice(0, 12) + '…' : ev.title}
                        size="small"
                        sx={{ background: ev.color, color: '#000', fontWeight: 700, mb: 0.5 }}
                        onClick={e => { e.stopPropagation(); setViewEvent(ev); }}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <Chip
                        label={`+${dayEvents.length - 2} more`}
                        size="small"
                        sx={{ background: '#00e6ff', color: '#000', fontWeight: 700 }}
                        onClick={e => { e.stopPropagation(); setViewEvent(dayEvents[0]); }}
                      />
                    )}
                  </Stack>
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', bottom: 4, right: 4, color: '#00e6ff', background: '#222', borderRadius: 1, p: 0.5, display: day ? 'flex' : 'none' }}
                    onClick={e => { e.stopPropagation(); handleDayClick(day); }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', borderRadius: 3, border: '1px solid #333' } }}>
        <DialogTitle sx={{ color: '#00e6ff', borderBottom: '1px solid #333', fontWeight: 700 }}>Add Event</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Title"
            value={newEvent.title}
            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } }, '& .MuiInputBase-input::placeholder': { color: '#666' } }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#00e6ff' }}>Type</InputLabel>
            <Select
              value={newEvent.type}
              onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
              sx={{ color: '#fff', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' } }}
              label="Type"
            >
              {eventTypes.map(ev => (
                <MenuItem key={ev.label} value={ev.label}>{ev.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={newEvent.time}
                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } } }}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Description"
            value={newEvent.description}
            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#00e6ff' }, '&.Mui-focused fieldset': { borderColor: '#00e6ff' } }, '& .MuiInputBase-input::placeholder': { color: '#666' } }}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              icon={<Alarm sx={{ color: newEvent.reminder ? '#00e6ff' : '#666' }} />}
              label={newEvent.reminder ? 'Reminder On' : 'Reminder Off'}
              clickable
              onClick={() => setNewEvent({ ...newEvent, reminder: !newEvent.reminder })}
              sx={{ background: newEvent.reminder ? '#00e6ff' : '#333', color: newEvent.reminder ? '#000' : '#00e6ff', fontWeight: 700 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setShowDialog(false)} sx={{ color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEvent} sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, borderRadius: 2, '&:hover': { background: '#00b3cc' } }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={!!viewEvent} onClose={() => setViewEvent(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', borderRadius: 3, border: '1px solid #333' } }}>
        <DialogTitle sx={{ color: '#00e6ff', borderBottom: '1px solid #333', fontWeight: 700 }}>Event Details</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewEvent && (
            <>
              <Typography variant="h6" color="#00e6ff" fontWeight={700} mb={1}>{viewEvent.title}</Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Chip label={viewEvent.type} sx={{ background: viewEvent.color, color: '#000', fontWeight: 700 }} />
                <Typography variant="body2" color="#fff">{formatDate(viewEvent.date)} {viewEvent.time && `at ${viewEvent.time}`}</Typography>
              </Box>
              <Typography variant="body1" color="#fff" mb={2} sx={{ background: '#222', p: 2, borderRadius: 2, border: '1px solid #333', whiteSpace: 'pre-wrap' }}>{viewEvent.description}</Typography>
              <Box mb={2}>
                <Chip
                  icon={<Alarm sx={{ color: viewEvent.reminder ? '#00e6ff' : '#666' }} />}
                  label={viewEvent.reminder ? 'Reminder On' : 'Reminder Off'}
                  sx={{ background: viewEvent.reminder ? '#00e6ff' : '#333', color: viewEvent.reminder ? '#000' : '#00e6ff', fontWeight: 700 }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setViewEvent(null)} sx={{ color: '#666' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 