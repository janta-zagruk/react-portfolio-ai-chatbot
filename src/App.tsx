import "./App.css";
import FloatingChatBot from "./FloatingChatbot";
import resumePdf from "/resume.pdf";

function App() {
  const handleOpen = (): void => {
    console.log("open");
  };
  const handleClose = (): void => {
    console.log("close");
  };
  return (
    <>
      <FloatingChatBot
        name={"Ian Hansson"}
        theme={"dark"}
        secret_key={import.meta.env.VITE_OPENROUTER_API_KEY}
        context_file={resumePdf}
        model={"google/gemini-flash-1.5-8b"}
        chatbotName={"Career Assistant"}
        autoOpen={false}
        initialGreeting={`Hello! I'm Ian's AI assistant. I can help you assess how well their skills align with your job description and provide structured insights about Ian's qualifications.`}
        inputPlaceHolderText={"Ask me anything..."}
        customErrorMessage={"Sorry, I couldn't process that."}
        onOpen={() => handleOpen()}
        onClose={() => handleClose()}
        // timezone={"America/Los_Angeles"}
      />
    </>
  );
}

export default App;
