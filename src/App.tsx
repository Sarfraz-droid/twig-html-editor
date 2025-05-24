import { Toaster } from 'sonner'
import { ThemeProvider } from './ThemeProvider'
import { TwigEditor } from './screen/TwigEditor'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <TwigEditor />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
