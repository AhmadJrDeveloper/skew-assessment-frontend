import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddNote from "./pages/AddNote/AddNote";
import UpdateNote from "./pages/UpdateNote/UpdateNote";
// import './Route.css'
const AppRoute = () => {
 return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddNote />} />
        <Route path="/update" element={<UpdateNote />} />
      </Routes>
    </Router>
 );
};


export default AppRoute;
