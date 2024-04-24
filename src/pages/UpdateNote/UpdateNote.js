import axios from "axios";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Searchbar from "../../components/Searchbar/Searchbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./UpdateNote.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.primary,
}));

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const UpdateNote = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/note`);
        setNotes(res.data);
        setFilteredNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const sortedNotes = [...filteredNotes].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    setFilteredNotes(sortedNotes);
  }, [sortOrder, filteredNotes]);

  const handleSearch = (searchTerm) => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  const handleUpdate = async () => {
    try {
      const updatedNote = {
        title: updatedTitle,
        content: updatedContent,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/note/${selectedNote._id}`,
        updatedNote
      );

      if (response.status === 200) {
        const updatedNotes = notes.map((note) =>
          note._id === selectedNote._id ? response.data : note
        );
        setNotes(updatedNotes);
        setFilteredNotes(updatedNotes);
        setUpdateDialogOpen(false);
        toast.success("Note updated successfully");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.error("An error occurred while updating the Note");
      }
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setUpdatedTitle(note.title);
    setUpdatedContent(note.content);
    setOpenDialog(true);
  };

  const handleOpenUpdateDialog = (e, note) => {
    e.stopPropagation();
    setSelectedNote(note);
    setUpdatedTitle(note.title);
    setUpdatedContent(note.content);
    setUpdateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"0 1rem"}}>
      <Searchbar onChange={handleSearch} />
      <FormControl variant="outlined" size="medium">
            <InputLabel id="sort-select-label">Sort Order</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort Order"
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
            </div>
      <div className="home-container">
        <h1>Notes</h1>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {filteredNotes.map((note, index) => (
              <Grid item xs={12} key={index}>
                <Item onClick={() => handleNoteClick(note)}>
                  <div className="note-header">
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                      {note.title}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => handleOpenUpdateDialog(e, note)}
                    >
                      <EditIcon style={{ color: "#1976D2" }} />
                    </IconButton>
                  </div>
                  <Typography variant="body1">
                    {truncateText(note.content, 185)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Created At: {new Date(note.createdAt).toLocaleString()}
                  </Typography>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedNote && selectedNote.title}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              {selectedNote && selectedNote.content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Created At:{" "}
              {selectedNote &&
                new Date(selectedNote.createdAt).toLocaleString()}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Update Note</DialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default UpdateNote;
