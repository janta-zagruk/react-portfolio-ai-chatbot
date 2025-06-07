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
        theme={"light"}
        secret_key={import.meta.env.VITE_OPENROUTER_API_KEY}
        context_file={resumePdf}
        endpointUrl={"https://api.openrouter.ai"}
        model={"google/gemini-flash-1.5-8b"}
        chatbotName={"Career Assistant"}
        autoOpen={false}
        initialGreeting={`Hello! I'm Ian's AI assistant. I can help you assess how well their skills align with your job description and provide structured insights about Ian's qualifications.`}
        inputPlaceHolderText={"Ask me anything..."}
        customErrorMessage={"Sorry, I couldn't process that."}
        position="right"
        chatWindowMaxHeight={"70vh"}
        onOpen={() => handleOpen()}
        onClose={() => handleClose()}
        chatMessageFontSize="12px"
        chatMessageFontFamily="Arial, sans-serif"
        sendButtonColor='rgb(241, 99, 99)'
        toggleButtonColor='linear-gradient(135deg,rgb(241, 99, 99),rgb(246, 92, 92),rgb(239, 143, 70))'
        // timezone={"America/Los_Angeles"}
        // dateTimeFormat=''
      />
    </>
  );
}

export default App;
