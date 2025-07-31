import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css'
import Home from "./components/pages/customer/Home";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
