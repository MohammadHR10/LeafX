LeafX — AI Sustainability Adventure 🌱

Tagline: Be a hero for the planet—learn, act, and see your impact in real-time.

🌍 Inspiration

We wanted to help corporations and individuals adopt sustainability practices without requiring constant human supervision. LeafX makes eco-friendly choices effortless by automating suggestions and tracking impact.

💡 What it Does

LeafX is an AI-powered SaaS app that suggests eco-friendly supplies and encourages daily sustainable habits. It helps save money while reducing environmental impact.

Features include:

🔮 AI recommendations (via Google Gemini AI)
🎙️ Voice guidance for motivation (via ElevenLabs)
📊 Visual dashboards for impact tracking
🕹️ Gamified rewards and challenges (via Agentuity)

Users can log activities such as recycling, biking, or reducing energy usage and immediately see their environmental footprint reduced.

🛠️ How We Built It

We used a modern full-stack setup:

Frontend: React.js with @auth0/auth0-react for secure login
Backend: Node.js + Express for API services
APIs & AI Services:
Google Gemini AI (eco-friendly suggestions)
ElevenLabs (voice feedback)
Agentuity (gamification)
Authentication & Security: Auth0 for login/signup
Database: MongoDB
Deployment:
Frontend: Vercel/Netlify
Backend: Heroku/Render

We also configured a proxy for seamless API calls between frontend and backend.

🚧 Challenges We Faced
Handling Auth0 login flows and callback URLs correctly
Avoiding CORS issues when connecting frontend & backend
Managing multiple async API calls and syncing data
Building real-time updates for the dashboard
🏆 Accomplishments We’re Proud Of
Fully functional MVP: log eco-actions, get AI advice, hear voice feedback, and track results
Gamification system that encourages repeated sustainable actions
Clean, responsive UI for both web and mobile screens
📚 What We Learned
Effective integration of multiple third-party APIs
Best practices for authentication with Auth0 in React
Handling async data fetching and state management in React
Importance of testing and debugging full-stack applications
🚀 What’s Next for LeafX
Real-time tracking using IoT devices or phone sensors
Push notifications for eco-task reminders
AR visualizations of environmental impact
Expanded gamification with leaderboards and team challenges
🔧 Built With
Frontend: React.js, JavaScript, Charts.js
Backend: Node.js, Express.js
Database: MongoDB
Authentication: Auth0
AI & APIs: Google Gemini AI, ElevenLabs (voice), Agentuity (gamification)
Deployment: Vercel/Netlify (frontend), Heroku/Render (backend)
Other Tools: Git/GitHub, NPM, environment variables
📂 Try It Out
GitHub Repo: Your Repo Link Here
Live Demo (if available): Deployed App Link Here
