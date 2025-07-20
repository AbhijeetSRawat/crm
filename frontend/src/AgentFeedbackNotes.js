import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Chip,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Stack,
} from '@mui/material';
import {
  Search,
  Add,
  AttachFile,
  Star,
  StarBorder,
  Feedback,
  Note,
  Person,
  CalendarToday,
  FilterList,
  Close,
  Send,
  Edit,
  Delete,
  Tag,
  History,
  Comment,
  Email,
  Phone,
  Assignment,
  Done,
  ErrorOutline,
} from '@mui/icons-material';

// Mock data for leads/calls
const mockLeads = [
  { id: 1, name: 'John Doe', type: 'Lead', avatar: '', contact: 'john@example.com' },
  { id: 2, name: 'Jane Smith', type: 'Call', avatar: '', contact: '+91 9876543210' },
  { id: 3, name: 'Acme Corp', type: 'Lead', avatar: '', contact: 'info@acme.com' },
];

const mockNotes = [
  {
    id: 101,
    leadId: 1,
    author: 'Agent 1',
    date: '2025-07-10T14:30:00Z',
    feedback: 'Customer was interested in the new product. Follow up next week.',
    tags: ['interested', 'follow-up'],
    attachments: [],
  },
  {
    id: 102,
    leadId: 2,
    author: 'Agent 2',
    date: '2025-07-09T11:00:00Z',
    feedback: 'Call dropped, will retry tomorrow.',
    tags: ['call dropped'],
    attachments: [],
  },
  {
    id: 103,
    leadId: 3,
    author: 'Agent 3',
    date: '2025-07-08T16:45:00Z',
    feedback: 'Requested a demo. Sent invite for Friday.',
    tags: ['demo', 'invite sent'],
    attachments: [],
  },
];

const quickTags = [
  'interested',
  'not interested',
  'follow-up',
  'call dropped',
  'demo',
  'urgent',
  'positive',
  'negative',
  'needs info',
  'invite sent',
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AgentFeedbackNotes() {
  const [notes, setNotes] = useState(mockNotes);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [newNote, setNewNote] = useState({ leadId: '', feedback: '', tags: [], attachments: [] });
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterTag, setFilterTag] = useState('all');
  const [viewNote, setViewNote] = useState(null);

  const filteredNotes = notes.filter(note => {
    const leadMatch = selectedLead === 'all' || note.leadId === selectedLead;
    const tagMatch = filterTag === 'all' || note.tags.includes(filterTag);
    const searchMatch =
      note.feedback.toLowerCase().includes(search.toLowerCase()) ||
      (mockLeads.find(l => l.id === note.leadId)?.name.toLowerCase() || '').includes(search.toLowerCase());
    return leadMatch && tagMatch && searchMatch;
  });

  const handleAddNote = () => {
    setShowDialog(true);
    setNewNote({ leadId: '', feedback: '', tags: [], attachments: [] });
    setSelectedTags([]);
  };

  const handleSaveNote = () => {
    if (!newNote.leadId || !newNote.feedback) return;
    setNotes([
      {
        id: Date.now(),
        leadId: newNote.leadId,
        author: 'Agent 1',
        date: new Date().toISOString(),
        feedback: newNote.feedback,
        tags: selectedTags,
        attachments: newNote.attachments,
      },
      ...notes,
    ]);
    setShowDialog(false);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Feedback sx={{ fontSize: 40, color: '#00e6ff' }} />
        <Box>
          <Typography variant="h4" fontWeight={900} color="#00e6ff">
            Customer Feedback & Notes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Log feedback and notes per lead/call
          </Typography>
        </Box>
        <Box flex={1} />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNote}
          sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, borderRadius: 2, '&:hover': { background: '#00b3cc' } }}
        >
          Add Note
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search feedback or lead..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: '#00e6ff', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00e6ff' },
                '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
              },
              '& .MuiInputBase-input::placeholder': { color: '#666' },
            }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#00e6ff' }}>Lead/Call</InputLabel>
            <Select
              value={selectedLead}
              onChange={e => setSelectedLead(e.target.value)}
              sx={{ color: '#fff', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' } }}
              label="Lead/Call"
            >
              <MenuItem value="all">All</MenuItem>
              {mockLeads.map(lead => (
                <MenuItem key={lead.id} value={lead.id}>{lead.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#00e6ff' }}>Tag</InputLabel>
            <Select
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              sx={{ color: '#fff', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' } }}
              label="Tag"
            >
              <MenuItem value="all">All</MenuItem>
              {quickTags.map(tag => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Notes List */}
      <Paper sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', border: '1px solid #333', borderRadius: 3, p: 2 }}>
        <List>
          {filteredNotes.length === 0 && (
            <ListItem>
              <ListItemText primary="No feedback or notes found." secondary="Try adjusting your filters or search." />
            </ListItem>
          )}
          {filteredNotes.map(note => {
            const lead = mockLeads.find(l => l.id === note.leadId);
            return (
              <ListItem key={note.id} alignItems="flex-start" sx={{ borderBottom: '1px solid #222', mb: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#00e6ff', color: '#000' }}>{lead?.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={lead?.name || 'Unknown'}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="#00e6ff">
                        {formatDate(note.date)}
                      </Typography>
                      {' — '}
                      <Typography component="span" variant="body2" color="#fff">
                        {note.feedback.length > 80 ? note.feedback.slice(0, 80) + '...' : note.feedback}
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {note.tags.map((tag, idx) => (
                          <Chip key={idx} label={tag} size="small" sx={{ background: '#333', color: '#00e6ff', fontSize: '0.7rem' }} />
                        ))}
                      </Box>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => setViewNote(note)} sx={{ color: '#00e6ff' }}>
                      <Comment />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Add Note Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', borderRadius: 3, border: '1px solid #333' } }}>
        <DialogTitle sx={{ color: '#00e6ff', borderBottom: '1px solid #333', fontWeight: 700 }}>Add Feedback/Note</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#00e6ff' }}>Lead/Call</InputLabel>
            <Select
              value={newNote.leadId}
              onChange={e => setNewNote({ ...newNote, leadId: e.target.value })}
              sx={{ color: '#fff', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00e6ff' } }}
              label="Lead/Call"
            >
              {mockLeads.map(lead => (
                <MenuItem key={lead.id} value={lead.id}>{lead.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Feedback/Note"
            value={newNote.feedback}
            onChange={e => setNewNote({ ...newNote, feedback: e.target.value })}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00e6ff' },
                '&.Mui-focused fieldset': { borderColor: '#00e6ff' },
              },
              '& .MuiInputBase-input::placeholder': { color: '#666' },
            }}
          />
          <Box mb={2}>
            <Typography variant="body2" color="#00e6ff" mb={1} fontWeight={700}>Quick Tags</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {quickTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  clickable
                  onClick={() => handleTagToggle(tag)}
                  sx={{ background: selectedTags.includes(tag) ? '#00e6ff' : '#333', color: selectedTags.includes(tag) ? '#000' : '#00e6ff', border: selectedTags.includes(tag) ? '1px solid #00e6ff' : '1px solid #333', fontWeight: 600 }}
                />
              ))}
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AttachFile />}
            sx={{ color: '#00e6ff', borderColor: '#00e6ff', borderRadius: 2, mb: 2 }}
            component="label"
          >
            Attach File
            <input
              type="file"
              hidden
              onChange={e => setNewNote({ ...newNote, attachments: [...newNote.attachments, ...Array.from(e.target.files)] })}
              multiple
            />
          </Button>
          <Stack direction="row" spacing={1} mt={1}>
            {newNote.attachments.map((file, idx) => (
              <Chip key={idx} label={file.name} size="small" sx={{ background: '#333', color: '#00e6ff' }} />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setShowDialog(false)} sx={{ color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNote} sx={{ background: '#00e6ff', color: '#000', fontWeight: 700, borderRadius: 2, '&:hover': { background: '#00b3cc' } }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog open={!!viewNote} onClose={() => setViewNote(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', color: '#fff', borderRadius: 3, border: '1px solid #333' } }}>
        <DialogTitle sx={{ color: '#00e6ff', borderBottom: '1px solid #333', fontWeight: 700 }}>Feedback/Note Details</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewNote && (
            <>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: '#00e6ff', color: '#000' }}>{mockLeads.find(l => l.id === viewNote.leadId)?.name[0]}</Avatar>
                <Box>
                  <Typography variant="h6" color="#00e6ff" fontWeight={700}>{mockLeads.find(l => l.id === viewNote.leadId)?.name}</Typography>
                  <Typography variant="body2" color="#fff">{formatDate(viewNote.date)}</Typography>
                </Box>
              </Box>
              <Typography variant="body1" color="#fff" mb={2} sx={{ background: '#222', p: 2, borderRadius: 2, border: '1px solid #333', whiteSpace: 'pre-wrap' }}>{viewNote.feedback}</Typography>
              <Box mb={2}>
                <Typography variant="body2" color="#00e6ff" fontWeight={700}>Tags</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {viewNote.tags.map((tag, idx) => (
                    <Chip key={idx} label={tag} size="small" sx={{ background: '#333', color: '#00e6ff' }} />
                  ))}
                </Box>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="#00e6ff" fontWeight={700}>Attachments</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  {viewNote.attachments.length === 0 && <Typography variant="body2" color="#666">No attachments</Typography>}
                  {viewNote.attachments.map((file, idx) => (
                    <Chip key={idx} label={file.name} size="small" sx={{ background: '#333', color: '#00e6ff' }} />
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
          <Button onClick={() => setViewNote(null)} sx={{ color: '#666' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 