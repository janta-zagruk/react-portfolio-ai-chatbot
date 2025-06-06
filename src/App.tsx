import "./App.css";
import FloatingChatBot  from "./FloatingChatbot";
import resumePdf from "/resume.pdf";

function App() {

  return (
    <>
      <FloatingChatBot
        name={"Ian Hansson"}
        theme={"dark"}
        secret_key={import.meta.env.VITE_OPENROUTER_API_KEY}
        context_file={resumePdf}
      />
    </>
  );
}

export default App;
