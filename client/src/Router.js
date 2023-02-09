import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sheet from "./pages/Sheet";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Sheet" element={<Sheet />} />
        <Route path="/" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;