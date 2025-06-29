# Time Capsule Project

A modern web application for creating, sealing, and delivering digital time capsules to yourself or others in the future. Built with Django (backend) and React (frontend), supporting rich content, scheduled delivery, notifications, and secure authentication (including Google SSO and OTP-based flows).

---

## Features

- **User Registration & Login**
  - Email/Password registration with OTP email verification
  - Google SSO (Single Sign-On) integration with FedCM support
  - Secure password reset via OTP (3-step process)
  - JWT and DRF Token authentication
  - Cached user data for improved performance

- **Time Capsule Creation**
  - Multi-step capsule creation wizard (5 steps)
  - Add text messages, images, videos, audio, and documents
  - Schedule delivery date and time with validation
  - Assign recipients by email with validation
  - Real-time preview of capsule content

- **Capsule Delivery & Viewing**
  - Automated capsules delivery via Celery scheduled tasks
  - Recipients receive secure access tokens via email
  - Public capsule viewing with unique access tokens
  - Capsule status tracking: Draft, Sealed, Delivered, Opened

- **Dashboard & Management**
  - Modern dashboard with capsule status visualization
  - Capsule grid layout with status icons and colors
  - Capsule editing, deletion, and detailed view
  - User profile management with theme preferences

- **Notifications & UI**
  - In-app notifications for delivery, opening, and system events
  - Toast notifications for user feedback
  - Loading states and error handling
  - Responsive design for mobile and desktop

- **Dark/Light Theme**
  - Theme switcher with persistent preference (localStorage)
  - Fully responsive and accessible UI
  - Smooth theme transitions and animations

- **Media Storage**
  - Cloudinary integration for reliable media storage
  - Support for images, videos, audio, and documents
  - Automatic file cleanup on deletion
  - File type validation and size limits

---

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, Vite, Axios, React Router
- **Backend:** Django 5.2, Django REST Framework, SimpleJWT, Celery, PostgreSQL
- **Storage:** Cloudinary (for media files)
- **Database:** Neon PostgreSQL (cloud-hosted)
- **Email:** Gmail SMTP with app passwords
- **SSO:** Google Identity Services (`@react-oauth/google`)
- **Task Queue:** Celery with Redis broker
- **Other:** CORS configured, Django cleanup for file management

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- Redis (for Celery)
- Cloudinary account (for media storage)
- Neon PostgreSQL database
- Google Cloud OAuth Client ID

### 1. Clone the Repository

```bash
git clone https://github.com/Soumen3/time_capsule.git
cd time_capsule
```

### 2. Backend Setup

#### a. Environment Variables

Create a `.env` file in the project root with:

```env
# Email Configuration
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### b. Install Dependencies

```bash
cd time_capsule_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### c. Run Migrations

```bash
python manage.py migrate
```

#### d. Create Superuser

```bash
python manage.py createsuperuser
```

#### e. Start Redis Server

```bash
# On Ubuntu/Debian
sudo systemctl start redis-server

# On macOS with Homebrew
brew services start redis

# On Windows, download and install Redis
```

#### f. Start Celery Worker & Beat (in separate terminals)

```bash
# Terminal 1: Celery Worker
celery -A time_capsule_backend worker -l info

# Terminal 2: Celery Beat (for scheduled tasks)
celery -A time_capsule_backend beat -l info
```

#### g. Run the Backend Server

```bash
python manage.py runserver
```

---

### 3. Frontend Setup

#### a. Environment Variables

Create a `.env` file in the frontend root (`time-capsule-frontend/`) with:

```env
VITE_API_BASE_URL=http://localhost:8000/api/
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### b. Install Dependencies

```bash
cd time-capsule-frontend
npm install
```

#### c. Start the Frontend

```bash
npm run dev
```

---

## Usage

1. Visit `http://localhost:5173` in your browser
2. Register a new account (OTP verification required via email)
3. Alternatively, use Google SSO for instant registration
4. Create time capsules using the 5-step wizard:
   - Step 1: Enter title and description
   - Step 2: Add media files and text content
   - Step 3: Specify recipient email
   - Step 4: Set delivery date and time
   - Step 5: Review and seal the capsule
5. Recipients receive secure links via email when capsules are delivered
6. Track capsule status on your dashboard

---

## Project Structure

```
Time_Capsule_Project/
├── time_capsule_backend/          # Django backend
│   ├── accounts/                  # User auth, SSO, OTP, profile
│   │   ├── models.py             # Custom User model with OTP fields
│   │   ├── serializers.py       # Auth, registration, password reset
│   │   ├── views.py              # Login, register, Google SSO, OTP
│   │   └── utils.py              # Email utilities
│   ├── capsules/                 # Capsule management
│   │   ├── models.py             # Capsule, Content, Recipients, Notifications
│   │   ├── serializers.py       # Capsule CRUD operations
│   │   ├── views.py              # Capsule API endpoints
│   │   ├── tasks.py              # Celery tasks for delivery
│   │   └── utils.py              # Email delivery utilities
│   ├── time_capsule_backend/     # Django project settings
│   │   ├── settings.py           # Cloudinary, Celery, email config
│   │   └── urls.py               # URL routing
│   └── requirements.txt          # Python dependencies
├── time-capsule-frontend/         # React frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Dashboard/        # Dashboard-specific components
│   │   │   ├── Layout/           # Layout components (Navbar, etc.)
│   │   │   └── ...
│   │   ├── pages/                # Page components
│   │   │   ├── Auth/             # Authentication pages
│   │   │   └── ...
│   │   ├── context/              # React contexts (Theme, etc.)
│   │   ├── services/             # API services (auth, capsule)
│   │   ├── hooks/                # Custom React hooks
│   │   └── ...
│   ├── public/                   # Static assets (logos, icons)
│   └── package.json              # Node.js dependencies
├── .env                          # Environment variables
└── README.md                     # This file
```

---

## Key Features & Implementation

### Authentication System
- **OTP Verification**: 6-digit OTP sent via email for registration and password reset
- **Google SSO**: Seamless login with Google accounts using `@react-oauth/google`
- **Token Management**: DRF tokens with cached user data for improved performance
- **Security**: Password validation, CORS protection, secure token handling

### Capsule Management
- **Multi-step Creation**: Intuitive 5-step wizard with validation at each step
- **Media Handling**: Cloudinary integration for reliable file storage and delivery
- **Scheduling**: Precise date/time scheduling with Celery for automated delivery
- **Status Tracking**: Real-time status updates (Draft → Sealed → Delivered → Opened)

### Modern UI/UX
- **Theme Support**: Dark/light mode with smooth transitions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Comprehensive loading indicators and error handling
- **Notifications**: Toast notifications for user feedback

---

## Deployment Considerations

### Production Environment Variables
```env
# Security
DEBUG=False
SECRET_KEY=your_production_secret_key

# Database
DATABASE_URL=your_production_database_url

# Email (production SMTP)
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USE_TLS=True

# Frontend URL
FRONTEND_BASE_URL=https://your-domain.com

# Cloudinary (same as development)
CLOUDINARY_CLOUD_NAME=your_cloud_name
# ... other Cloudinary configs
```

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Set secure CORS origins
- [ ] Use production database with SSL
- [ ] Configure proper email authentication
- [ ] Set up monitoring for Celery tasks
- [ ] Enable Django's security middleware
- [ ] Use environment variables for all secrets

---

## API Endpoints

### Authentication
- `POST /api/accounts/register/` - User registration with OTP
- `POST /api/accounts/verify-account/` - Verify OTP and activate account
- `POST /api/accounts/login/` - Email/password login
- `POST /api/accounts/google-login/` - Google SSO login
- `POST /api/accounts/password-reset/request-otp/` - Request password reset OTP
- `POST /api/accounts/password-reset/verify-otp/` - Verify password reset OTP
- `POST /api/accounts/password-reset/set-new-password/` - Set new password

### Capsules
- `GET /api/capsules/` - List user's capsules
- `POST /api/capsules/` - Create new capsule
- `GET /api/capsules/{id}/` - Get capsule details
- `PUT /api/capsules/{id}/` - Update capsule
- `DELETE /api/capsules/{id}/` - Delete capsule
- `GET /api/view-capsule/{access_token}/` - Public capsule view

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Credits & Acknowledgments

- [Django](https://www.djangoproject.com/) - Backend framework
- [React](https://react.dev/) - Frontend library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Cloudinary](https://cloudinary.com/) - Media storage and delivery
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Google Identity Services](https://developers.google.com/identity) - SSO integration
- [Celery](https://docs.celeryq.dev/) - Task queue
- [Redis](https://redis.io/) - Message broker

---

## Support & Contact

For questions, bug reports, or feature requests:

- **Email**: [soumensamanta112233@gmail.com](mailto:soumensamanta112233@gmail.com)
- **GitHub Issues**: [Create an issue](https://github.com/Soumen3/time_capsule/issues)
- **GitHub Profile**: [@Soumen3](https://github.com/Soumen3)

---

## Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Capsule templates
- [ ] Social sharing features
- [ ] Advanced notification settings
- [ ] Bulk capsule operations
- [ ] Analytics dashboard
- [ ] Multi-language support

### Known Issues
- [ ] Large file uploads may timeout on slow connections
- [ ] Theme flash during initial load
- [ ] Mobile responsiveness improvements needed for very small screens

---

*Last updated: December 2024*

