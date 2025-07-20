import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    TextField,
    Button,
    Grid,
    Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import api from './services/api';

export default function AdminAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(dayjs());
    const [stats, setStats] = useState({ present: 0, absent: 0 });

    useEffect(() => {
        fetchAttendance(date);
        // eslint-disable-next-line
    }, [date]);

    const fetchAttendance = async (selectedDate) => {
        setLoading(true);
        try {
            const res = await api.get(`/attendance/all?date=${selectedDate.format('YYYY-MM-DD')}`);
            setAttendance(res.data.attendance || []);
            setStats(res.data.stats || { present: 0, absent: 0 });
        } catch (err) {
            setAttendance([]);
            setStats({ present: 0, absent: 0 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
                Agent Attendance Overview
            </Typography>
            <Paper sx={{ p: 2, mb: 3, background: 'rgba(10,10,10,0.7)', boxShadow: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <DatePicker
                            label="Select Date"
                            value={date}
                            onChange={setDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => fetchAttendance(date)}>
                            Refresh
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Box display="flex" justifyContent="flex-end" gap={4}>
                            <Typography variant="subtitle1" color="success.main">
                                Present: {stats.present}
                            </Typography>
                            <Typography variant="subtitle1" color="error.main">
                                Absent: {stats.absent}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ background: 'rgba(24,24,24,0.9)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Agent Name</b></TableCell>
                                <TableCell><b>Email</b></TableCell>
                                <TableCell><b>First Login</b></TableCell>
                                <TableCell><b>Last Logout</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendance.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No attendance records found.</TableCell>
                                </TableRow>
                            ) : (
                                attendance.map((row) => (
                                    <TableRow key={row.agent_id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.first_login ? dayjs(row.first_login).format('HH:mm:ss') : '-'}</TableCell>
                                        <TableCell>{row.last_logout ? dayjs(row.last_logout).format('HH:mm:ss') : '-'}</TableCell>
                                        <TableCell>
                                            <Typography color={row.present ? 'success.main' : 'error.main'}>
                                                {row.present ? 'Present' : 'Absent'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
} 