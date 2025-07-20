// AdminAttendance.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Grid, Chip, LinearProgress
} from '@mui/material';

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const fetchAttendance = () => {
    setLoading(true);
    let url = '/api/attendance';
    const params = [];
    if (start) params.push(`start=${start}`);
    if (end) params.push(`end=${end}`);
    if (params.length) url += '?' + params.join('&');
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAttendance(data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line
  }, []);

  const presentDays = attendance.filter(r => r.status === 'present').length;
  const totalDays = attendance.length;

  return (
    <Box>
      <Typography variant="h4" fontWeight={900} color="#00e6ff" mb={2}>
        All Agents Attendance
      </Typography>
      <Paper sx={{ p: 2, mb: 2, background: '#181818', color: '#fff' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              label="Start Date"
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ background: '#222', borderRadius: 1 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="End Date"
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ background: '#222', borderRadius: 1 }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={fetchAttendance} sx={{ background: '#00e6ff', color: '#000', fontWeight: 700 }}>
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ background: '#181818', color: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#00e6ff' }}>Agent ID</TableCell>
                <TableCell sx={{ color: '#00e6ff' }}>Date</TableCell>
                <TableCell sx={{ color: '#00e6ff' }}>Login Time</TableCell>
                <TableCell sx={{ color: '#00e6ff' }}>Logout Time</TableCell>
                <TableCell sx={{ color: '#00e6ff' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.agent_id}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.login_time ? new Date(record.login_time).toLocaleTimeString() : '-'}</TableCell>
                  <TableCell>{record.logout_time ? new Date(record.logout_time).toLocaleTimeString() : '-'}</TableCell>
                  <TableCell>
                    <Chip label={record.status} color={record.status === 'present' ? 'success' : 'default'} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box mt={3}>
        <Typography variant="h6" color="#00e6ff">Total Records: {totalDays} | Days Present: {presentDays}</Typography>
        <LinearProgress variant="determinate" value={totalDays ? (presentDays / totalDays) * 100 : 0} sx={{ mt: 1, backgroundColor: '#333', "& .MuiLinearProgress-bar": { backgroundColor: '#4caf50' } }} />
      </Box>
    </Box>
  );
} 