import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./AddNote.css";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.primary,
}));

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and Content are required");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/note`, {
        title: title,
        content: content,
      });

    //   toast.success("Note added successfully!");

      
      Swal.fire({
        title: "Success!",
        text: "Note added successfully!",
        icon: "success",
        confirmButtonColor: "#1976D2",
      });

      setTitle("");
      setContent("");
      setError("");
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

  return (
    <div className="home-container">
      <h1>Add Note</h1>
      <form onSubmit={handleSubmit}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item>
                <TextField
                  id="title"
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={handleTitleChange}
                  error={!!error}
                  helperText={error}
                />
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <TextField
                  id="content"
                  label="Content"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={content}
                  onChange={handleContentChange}
                  error={!!error}
                  helperText={error}
                />
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Add Note
                </Button>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};

export default AddNote;
