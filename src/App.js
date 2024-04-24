import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddNote from "./pages/AddNote/AddNote";
import UpdateNote from "./pages/UpdateNote/UpdateNote";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from "./components/Searchbar/Searchbar";
function App() {
  return (
    <Router>
      <div>
        <Sidebar />
        {/* <Searchbar /> */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddNote />} />
          <Route path="/update" element={<UpdateNote />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
