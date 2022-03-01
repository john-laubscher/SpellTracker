import "./App.css";
import CharacterCreationForm from "../src/components/characterCreationForm";
import { Routes, Route, Link } from "react-router-dom";
import MainUI from "./components/mainUI";

// Should this be routes or just a modal that needs to be finished before access is given to the mainUI?
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/charCreation" element={<CharacterCreationForm />}></Route>
        <Route path="/mainUI" element={<MainUI />}></Route>
      </Routes>
      {/* <CharacterCreationForm /> */}
    </div>
  );
}

export default App;
