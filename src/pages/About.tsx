import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import './About.css'

function About() {
  return (
    <div className="page">
      <h1>About This App</h1>

      <section className="about-section">
        <h2>Technology Stack</h2>
        <ul>
          <li><strong>React 18</strong> - Modern UI library with hooks</li>
          <li><strong>TypeScript</strong> - Type-safe JavaScript</li>
          <li><strong>Vite</strong> - Fast build tool and dev server</li>
          <li><strong>React Router</strong> - Client-side routing</li>
          <li><strong>Zustand</strong> - Lightweight state management</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Features</h2>
        <ul>
          <li>Fast refresh with Vite HMR</li>
          <li>Type-safe development with TypeScript</li>
          <li>Client-side routing with React Router</li>
          <li>Global state management with Zustand</li>
          <li>Modern ESLint configuration</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Getting Started</h2>
        <p>
          This application is built with modern web technologies to provide
          a fast, type-safe, and maintainable development experience.
        </p>
        <p>
          Check out the <Link to={ROUTES.HOME}>Home</Link> page to see the counter in action,
          or explore the codebase to learn more.
        </p>
      </section>
    </div>
  )
}

export default About
