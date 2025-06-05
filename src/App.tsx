import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FloatingChatBot } from './FloatingChatbot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FloatingChatBot name={"John Doe"} theme={"light"} />
    </>
  )
}

export default App
