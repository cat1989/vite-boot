import * as React from 'react'
import { createRoot } from 'react-dom/client'

const container = document.createElement("div")
document.body.appendChild(container)

const App: React.FC = () => {
    return (
        <div>
            Hello world!
        </div>
    )
}

createRoot(container).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
