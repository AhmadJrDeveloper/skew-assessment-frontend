import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Searchbar from "../../components/Searchbar/Searchbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./Home.css";

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

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

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

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1976D2",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const deleteCategory = await axios.delete(
          `${process.env.REACT_APP_API_URL}/note/${id}`
        );
        if (deleteCategory.status === 200) {
          setNotes(notes.filter((note) => note._id !== id));
          setFilteredNotes(filteredNotes.filter((note) => note._id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Your Note has been deleted.",
            icon: "success",
            confirmButtonColor: "#1976D2",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while Deleting the Note");
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSearch = (searchTerm) => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 1rem",
        }}
      >
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
      </div>{" "}
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
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note._id);
                      }}
                    >
                      <DeleteIcon style={{ color: "#d33" }} />
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
      </div>
    </div>
  );
};

export default Home;
