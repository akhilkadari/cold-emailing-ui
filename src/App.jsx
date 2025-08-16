import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ConnectionAssistant from "./components/ConnectionAssistant";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ConnectionAssistant />} />
      </Routes>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
