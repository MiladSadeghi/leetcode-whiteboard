import { useState } from "react";
import Button from "./components/Button";
import Whiteboard from "./components/Whiteboard";

function App() {
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  return (
    <>
      <Button onClick={() => setShowWhiteboard(!showWhiteboard)} />
      {showWhiteboard && (
        <Whiteboard onClose={() => setShowWhiteboard(!showWhiteboard)} />
      )}
    </>
  );
}

export default App;
