export type FloatingChatBotProps = {
  name: string;
  theme?: "light" | "dark";
  secret_key: string,
  context_file : string,
  model: string;
  chatbotName?: string;
  autoOpen?: boolean;
  initialGreeting?: string;
  inputPlaceHolderText?: string;
  customErrorMessage?: string;
  userTitle?: string;
  botTitle?: string;
  onOpen?: () => void;
  onClose?: () => void;
};