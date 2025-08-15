# ByteChat 💬

A minimalistic social media web app designed with a cyberpunk theme in mind. Share your thoughts, connect with fellow developers, and stay updated with the latest in tech.

## ✨ Features

- **Authentication**: Secure user registration and login with NextAuth.js
- **Post Creation**: Share your thoughts with rich text posts
- **Image Sharing**: Upload and display images in your posts
- **Real-time Feed**: Infinite scroll feed with automatic updates
- **User Profiles**: Personalized profile pages with user statistics
- **Dark/Light Mode**: Toggle between themes with system preference support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Post Management**: Edit and delete your own posts
- **Trending Topics**: Discover what's popular in the community
- **User Discovery**: Find and connect with other developers

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[SWR](https://swr.vercel.app/)** - Data fetching with caching
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend

- **[NextAuth.js v5](https://authjs.dev/)** - Authentication
- **[Prisma](https://www.prisma.io/)** - Database ORM
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Zod](https://zod.dev/)** - Runtime type validation
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing

### Development & Testing

- **[Jest](https://jestjs.io/)** - Testing framework
- **[Testing Library](https://testing-library.com/)** - Testing utilities
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- MongoDB database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bytechat.git
   cd bytechat
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables:

   ```env
   DATABASE_URL="mongodb://localhost:27017/bytechat"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed  # Optional: populate with sample data
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

1. **Sign Up**: Create a new account with email and password
2. **Login**: Access your account securely
3. **Create Posts**: Share your thoughts and images
4. **Explore Feed**: Browse posts from other users
5. **Manage Profile**: View and edit your profile information
6. **Interact**: Like, comment, and share posts (coming soon)

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (protected)/       # Protected routes (require auth)
│   ├── api/               # API routes
│   └── login/             # Authentication pages
├── components/            # Reusable React components
│   └── ui/               # UI component library
├── lib/                  # Utility functions and configurations
└── middleware.ts         # Next.js middleware for route protection
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
