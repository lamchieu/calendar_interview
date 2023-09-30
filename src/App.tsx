import { useState } from "react";
import "./App.css";
import BoardContent from "./components/BoardContent/BoardContent";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BoardContent />
    </>
  );
}

export default App;
