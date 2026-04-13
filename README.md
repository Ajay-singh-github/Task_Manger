# Task Manager Dashboard

A modern, responsive task management application built with Next.js 16, featuring real-time updates, pagination, infinite scroll, and comprehensive error handling.

## 🚀 Features

### Core Functionality

- ✅ **Task CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **AI-Powered Descriptions** - Generate task descriptions using Google Gemini AI
- ✅ **User Authentication** - Secure login/register system with JWT tokens
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Advanced Features

- ✅ **Smart Pagination** - Traditional pagination for desktop, infinite scroll for mobile
- ✅ **Real-time Caching** - TanStack Query for optimal performance and offline support
- ✅ **Error Boundaries** - Comprehensive error handling with user-friendly notifications
- ✅ **Mobile-First UI** - Card-based layout on mobile, table on desktop
- ✅ **Theme Integration** - Dark theme with mobile status bar matching

### Performance & UX

- ✅ **Background Refetching** - Data stays fresh without blocking UI
- ✅ **Optimistic Updates** - Immediate UI feedback for better user experience
- ✅ **Loading States** - Proper loading indicators throughout the app
- ✅ **Toast Notifications** - Non-intrusive success/error messaging

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data fetching and caching
- **Heroicons** - Beautiful hand-crafted SVG icons

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication

### AI Integration

- **Google Gemini AI** - AI-powered task description generation

## 📦 Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- pnpm package manager

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nextjs-dashboard
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key-here
   GOOGLE_AI_API_KEY=your-google-gemini-api-key
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB locally or use MongoDB Atlas
   mongod
   ```

5. **Run the development server**

   ```bash
   pnpm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
nextjs-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── register/route.ts
│   │   ├── tasks/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── ai/route.ts
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   ├── Header.tsx
│   │   ├── NotificationContainer.tsx
│   │   ├── Pagination.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskRow.tsx
│   │   ├── TaskTable.tsx
│   │   ├── AddTaskModal.tsx
│   │   └── EditTaskModal.tsx
│   ├── hooks/
│   │   ├── useInfiniteScroll.ts
│   │   ├── useNotifications.ts
│   │   ├── useTaskForm.ts
│   │   ├── useTasks.ts
│   │   └── useTasksPaginated.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── customMethod.ts
│   │   ├── data.ts
│   │   └── dbConnect.ts
│   ├── models/
│   │   ├── taskModel.ts
│   │   └── userauthModal.ts
│   ├── providers.tsx
│   ├── services/
│   │   ├── queryKeys.ts
│   │   └── taskService.ts
│   ├── head.tsx
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── page.tsx
│   └── register/page.tsx
├── public/
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## 🎯 Key Components

### Error Handling System

- **ErrorBoundary**: Catches React errors and displays user-friendly messages
- **useNotifications**: Toast notification system for success/error messages
- **NotificationContainer**: Renders toast notifications with auto-dismiss

### Data Management

- **useTasksPaginated**: Dual-mode hook for pagination and infinite scroll
- **taskService**: Centralized API calls with proper error handling
- **QueryClient**: Optimized caching with TanStack Query

### Responsive Design

- **TaskTable**: Desktop table view with pagination
- **TaskCard**: Mobile card-based layout with infinite scroll
- **Header**: Responsive navigation with mobile-optimized buttons

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Tasks

- `GET /api/tasks?page=1&limit=10` - Get paginated tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### AI Features

- `POST /api/ai` - Generate task description using AI

## 📱 Mobile Features

### Responsive Breakpoints

- **Mobile (< 768px)**: Card layout + infinite scroll
- **Tablet (768px - 1024px)**: Card layout + pagination
- **Desktop (1024px+)**: Table layout + pagination

### Mobile Optimizations

- Touch-friendly buttons (44px minimum)
- Swipe gestures support
- Mobile status bar theming
- Progressive Web App capabilities

## 🚀 Performance Features

### Caching Strategy

- **Stale Time**: 1 minute for fresh data
- **Garbage Collection**: 10 minutes cache retention
- **Background Refetching**: Automatic data updates
- **Optimistic Updates**: Immediate UI feedback

### Loading States

- Skeleton loading for initial data
- Spinner indicators for actions
- Progressive loading for infinite scroll

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Task creation with AI description
- [ ] Task editing and deletion
- [ ] Pagination on desktop
- [ ] Infinite scroll on mobile
- [ ] Error handling scenarios
- [ ] Responsive design across devices

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Proper CORS configuration
- **Rate Limiting**: API rate limiting (recommended)

## 🚀 Deployment

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-jwt-secret
GOOGLE_AI_API_KEY=your-production-api-key
NEXTAUTH_SECRET=your-production-nextauth-secret
NEXTAUTH_URL=https://yourdomain.com
```

### Build Commands

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Start production server
pnpm start
```

### Recommended Hosting

- **Vercel**: Optimal for Next.js applications
- **Railway**: Great for full-stack apps with MongoDB
- **Netlify**: Good alternative with serverless functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [TanStack Query](https://tanstack.com/query) - Data fetching library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Heroicons](https://heroicons.com/) - Icon library
- [Google Gemini AI](https://ai.google.dev/) - AI integration

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Happy Task Managing! 🎯**
