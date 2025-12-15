# Excell PDT - Professional Driver Training Platform

A modern web-based training platform designed to certify commercial and passenger drivers in advanced driving techniques.

## 🚀 Features

- **Course Catalog**: Browse and filter courses by category (Commercial/Passenger)
- **User Authentication**: Secure sign up and login with Supabase Auth
- **Course Purchases**: One-time payment model for individual courses
- **Progress Tracking**: Track your learning progress across courses
- **Certifications**: Earn and download completion certificates
- **Dark Mode**: Beautiful dark/light theme support
- **Responsive Design**: Mobile-first, works on all devices

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Supabase** - Backend (Auth, Database, Storage)
- **Headless UI** - Accessible UI components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd excell_pdt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
excell_pdt/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── CourseCard.jsx
│   │   ├── CourseDetail.jsx
│   │   ├── CourseProgress.jsx
│   │   ├── PurchaseModal.jsx
│   │   └── AuthForm.jsx
│   ├── pages/            # Page components
│   │   ├── index.jsx     # Home page
│   │   ├── login.jsx
│   │   ├── register.jsx
│   │   ├── dashboard.jsx
│   │   ├── courses.jsx
│   │   ├── course/[id].jsx
│   │   └── certification.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.jsx
│   │   └── useCourseData.js
│   ├── services/         # API and service layers
│   │   ├── supabaseClient.js
│   │   ├── authService.js
│   │   ├── courseService.js
│   │   └── purchaseService.js
│   ├── styles/           # Global styles
│   │   ├── globals.css
│   │   └── theme.css
│   ├── utils/            # Utility functions
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── mockData.js
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── supabase_wiring_guide.md  # Supabase integration guide
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔌 Supabase Setup

This app uses Supabase for backend services. See [supabase_wiring_guide.md](./supabase_wiring_guide.md) for detailed setup instructions.

### Quick Setup Steps:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from the wiring guide
3. Configure Row Level Security (RLS) policies
4. Set up storage buckets for course content and certificates
5. Add your credentials to `.env`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The app uses TailwindCSS with a custom theme. Key design features:

- **Color Scheme**: Primary blue with gray neutrals
- **Dark Mode**: Automatic theme switching with system preference
- **Responsive**: Mobile-first breakpoints
- **Components**: Reusable button, card, and input styles

## 🔐 Authentication

- Email/password authentication via Supabase Auth
- Session persistence across page refreshes
- Protected routes for authenticated users
- Mock authentication available when Supabase is not configured

## 📚 Course Content

Course content can be loaded from:

1. **Supabase Database** (production)
2. **Mock Data** (development, see `src/utils/mockData.js`)
3. **JSON/Markdown files** (future implementation)

### Quiz System

The app includes a complete interactive quiz system:

- **Quiz Components**: `QuizQuestion`, `QuizContainer`, `QuizResults`
- **Chapter Integration**: Chapters can optionally include quizzes
- **Progress Tracking**: Quiz attempts are saved and tracked
- **Flexible Design**: Works for chapters with or without quizzes

See [QUIZ_PARSING_GUIDE.md](./QUIZ_PARSING_GUIDE.md) for details on parsing quizzes from Word documents.

## 🚢 Deployment

### Vercel (Recommended)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment guide.

**Quick Steps:**
1. Push your code to GitHub
2. Import project in Vercel (auto-detects Vite)
3. Configure settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables (if using Supabase):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

**Configuration files:**
- `vercel.json` - Already configured with SPA routing
- `package.json` - Includes Node.js version requirement

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🧪 Development Notes

- **Mock Data**: The app includes mock course data for development without Supabase
- **Service Layer**: All Supabase calls are abstracted in service files for easy mocking
- **Error Handling**: Services return `{ data, error }` pattern for consistent error handling

## 📋 TODO / Future Features

- [ ] Payment processing integration (Stripe)
- [ ] Course content parser for Word documents
- [ ] Video player for course content
- [ ] Quiz/assessment system
- [ ] Community forum
- [ ] Job board for certified drivers
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for course management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support, email support@excellpdt.com or open an issue in the repository.

---

**Built with ❤️ for professional drivers**

