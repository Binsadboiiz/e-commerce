import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/Mainlayout"


function App() {
  return (
    <>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" />
      </Route>
    </Routes>
    </>
  )
}

export default App
