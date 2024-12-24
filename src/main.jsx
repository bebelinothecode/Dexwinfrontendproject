import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BebelinoFoot from './components/footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <BebelinoFoot/>
  </StrictMode>,
)

// function App() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Main content goes here */}
//       <div className="flex-grow">
//         <h1 className="text-center mt-4">Welcome to My App</h1>
//       </div>

//       {/* Footer */}
//       <BebelinoFoot />
//     </div>
//   );
// }

// export default App;

