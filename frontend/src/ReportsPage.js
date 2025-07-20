import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import {
  Download,
  PictureAsPdf,
  TableChart,
  Assessment,
  Phone,
  Person,
  Schedule,
  FileUpload,
  Delete,
  Visibility,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const reportTypes = [
  { id: 1, name: "Agent Performance Report", type: "PDF", size: "2.3 MB", date: "2024-07-11", category: "Performance" },
  { id: 2, name: "Lead Conversion Report", type: "Excel", size: "1.8 MB", date: "2024-07-11", category: "Leads" },
  { id: 3, name: "Call Analytics Report", type: "PDF", size: "3.1 MB", date: "2024-07-10", category: "Calls" },
  { id: 4, name: "Task Completion Report", type: "Excel", size: "1.2 MB", date: "2024-07-10", category: "Tasks" },
  { id: 5, name: "Weekly Summary Report", type: "PDF", size: "4.2 MB", date: "2024-07-09", category: "Summary" },
];

const callRecordings = [
  { id: 1, agent: "Abhishek", lead: "Acme Corp", duration: "4m 32s", date: "2024-07-11", size: "2.1 MB" },
  { id: 2, agent: "Narayan", lead: "Beta Ltd", duration: "5m 18s", date: "2024-07-11", size: "2.8 MB" },
  { id: 3, agent: "Prince", lead: "Gamma Inc", duration: "3m 45s", date: "2024-07-11", size: "1.9 MB" },
];

export default function ReportsPage() {
  const [selectedReports, setSelectedReports] = useState([]);
  const [generateDialog, setGenerateDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReports(reportTypes.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (id) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(selectedReports.filter(r => r !== id));
    } else {
      setSelectedReports([...selectedReports, id]);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Performance": return "success";
      case "Leads": return "primary";
      case "Calls": return "warning";
      case "Tasks": return "info";
      case "Summary": return "secondary";
      default: return "default";
    }
  };

  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Paper elevation={6} sx={{
        mb: 4,
        p: 3,
        borderRadius: 6,
        background: 'rgba(24, 24, 32, 0.7)',
        boxShadow: '0 8px 32px 0 #00e6ff33',
        backdropFilter: 'blur(12px)',
      }}>
        <Typography variant="h4" fontWeight={800} color="primary.main" mb={2}>
          Reports
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            Reports & File Management
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<Assessment />}
              onClick={() => setGenerateDialog(true)}
            >
              Generate Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileUpload />}
              onClick={() => setUploadDialog(true)}
            >
              Upload Files
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              disabled={selectedReports.length === 0}
              onClick={() => alert(`Downloading ${selectedReports.length} reports...`)}
            >
              Bulk Download
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Reports Section */}
        <Grid item xs={12} md={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Paper elevation={4} sx={{
              borderRadius: 4,
              background: 'rgba(24, 24, 32, 0.7)',
              boxShadow: '0 4px 24px 0 #00e6ff22',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #00e6ff33',
              p: 2,
            }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" color="primary">Available Reports</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedReports.length === reportTypes.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  }
                  label="Select All"
                />
              </Box>
              <List>
                {reportTypes.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem>
                      <Checkbox
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                      />
                      <ListItemIcon>
                        {report.type === "PDF" ? <PictureAsPdf color="error" /> : <TableChart color="success" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={report.name}
                        secondary={`${report.size} • ${report.date}`}
                      />
                      <Chip label={report.category} color={getCategoryColor(report.category)} size="small" sx={{ mr: 1 }} />
                      <IconButton color="primary" size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton color="primary" size="small">
                        <Download />
                      </IconButton>
                      <IconButton color="error" size="small">
                        <Delete />
                      </IconButton>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>

        {/* Call Recordings Section */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Card sx={{ background: "#181818", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={2}>Call Recordings</Typography>
                <List>
                  {callRecordings.map((recording) => (
                    <ListItem key={recording.id}>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${recording.agent} - ${recording.lead}`}
                        secondary={`${recording.duration} • ${recording.size}`}
                      />
                      <IconButton color="primary" size="small">
                        <Download />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Download All Recordings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: "#181818", color: "#fff", textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight={900} color="primary.main">5</Typography>
                    <Typography variant="body2">Total Reports</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: "#181818", color: "#fff", textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight={900} color="success.main">3</Typography>
                    <Typography variant="body2">Call Recordings</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: "#181818", color: "#fff", textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight={900} color="warning.main">12.8 MB</Typography>
                    <Typography variant="body2">Total Size</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: "#181818", color: "#fff", textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight={900} color="info.main">24h</Typography>
                    <Typography variant="body2">Last Updated</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        </Grid>
      </Grid>

      {/* Generate Report Dialog */}
      <Dialog open={generateDialog} onClose={() => setGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Report Type</InputLabel>
            <Select label="Report Type" defaultValue="">
              <MenuItem value="performance">Agent Performance Report</MenuItem>
              <MenuItem value="leads">Lead Conversion Report</MenuItem>
              <MenuItem value="calls">Call Analytics Report</MenuItem>
              <MenuItem value="tasks">Task Completion Report</MenuItem>
              <MenuItem value="summary">Weekly Summary Report</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date Range"
            fullWidth
            margin="dense"
            defaultValue="Last 7 days"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Format</InputLabel>
            <Select label="Format" defaultValue="pdf">
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            alert("Report generation started!");
            setGenerateDialog(false);
          }}>
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Files Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ py: 3, border: "2px dashed #666" }}
          >
            <FileUpload sx={{ mr: 1 }} />
            Click to upload files
            <input type="file" hidden multiple />
          </Button>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
            Supported formats: PDF, Excel, MP3, MP4
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            alert("Files uploaded successfully!");
            setUploadDialog(false);
          }}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 