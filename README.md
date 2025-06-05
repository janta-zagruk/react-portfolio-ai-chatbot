# Floating Chatbot Component for React

A customizable floating chatbot UI component for React applications.

## Installation

```js
npm install react-portfolio-ai-chatbot
```

# or

```js
yarn add react-portfolio-ai-chatbot
```

```js
import FloatingChatBot from "your-package-name";

function App() {
  return (
    <FloatingChatBot
      name={"Ian Hansson"}
      theme={"dark"}
      // Other optional props
    />
  );
}

export default App;
```

## Props
<table>
  <tr>
    <th> Prop </th>
    <th> Type </th>
    <th> Description </th>
    <th> Default </th>
  </tr>
  <tr>
    <td> name </td>
    <td> string </td>
    <td> The name displayed in the chatbot header	 </td>
    <td> Required </td>
  </tr>
  <tr>
    <td> theme </td>
    <td> 'light' | 'dark' </td>
    <td> Color scheme of the chatbot </td>
    <td> 'light' </td>
  </tr>
  <tr>
    <td> position </td>
    <td> 'left' | 'right' </td>
    <td> Which side of screen to appear </td>
    <td> 'right' </td>
  </tr>
  <tr>
    <td> initialMessage </td>
    <td> string </td>
    <td> First message to display when opened </td>
    <td> 'Hello! How can I help you today?' </td>
  </tr>
</table>

## License

MIT © Md Sohail and Soumyadip Ghosh
