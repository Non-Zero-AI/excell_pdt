# 🔌 Supabase Wiring Guide for Excell PDT

This guide provides a comprehensive plan for integrating Supabase into the Excell PDT application. Follow these steps to connect your React frontend to Supabase for authentication, database, and storage.

---

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Database Schema](#database-schema)
3. [Authentication Configuration](#authentication-configuration)
4. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
5. [Storage Configuration](#storage-configuration)
6. [Environment Variables](#environment-variables)
7. [Example Queries](#example-queries)
8. [Testing Checklist](#testing-checklist)

---

## 🚀 Initial Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: `excell-pdt`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
5. Wait for project to initialize (~2 minutes)

### 2. Get Project Credentials

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (for client-side)
   - **service_role key** (keep secret, server-side only)

---

## 🗄️ Database Schema

### Tables Overview

```
users (managed by Supabase Auth)
├── courses
├── chapters
├── purchases
├── user_progress
└── certificates
```

### 1. Courses Table

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('commercial', 'passenger')),
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER, -- in minutes
  instructor TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for category filtering
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);
```

### 2. Chapters Table

```sql
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- or JSON for structured content
  order_index INTEGER NOT NULL,
  duration INTEGER, -- in minutes
  quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL, -- Optional quiz
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- Index for course chapters
CREATE INDEX idx_chapters_course_id ON chapters(course_id);
CREATE INDEX idx_chapters_order ON chapters(course_id, order_index);
CREATE INDEX idx_chapters_quiz_id ON chapters(quiz_id);
```

### 2a. Quizzes Table

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL, -- Array of question objects
  passing_score INTEGER DEFAULT 70, -- Percentage required to pass
  time_limit INTEGER, -- Optional time limit in minutes
  max_attempts INTEGER, -- Optional limit on retakes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_quizzes_chapter_id ON quizzes(chapter_id);
CREATE INDEX idx_quizzes_course_id ON quizzes(course_id);
```

**Quiz Questions JSON Structure:**
```json
{
  "questions": [
    {
      "id": "q1",
      "question": "What is the recommended following distance?",
      "answers": [
        { "id": "a1", "text": "2 seconds" },
        { "id": "a2", "text": "4 seconds" },
        { "id": "a3", "text": "6 seconds" },
        { "id": "a4", "text": "8 seconds" }
      ],
      "correctAnswer": "a3",
      "explanation": "Commercial vehicles require 6 seconds..."
    }
  ]
}
```

### 3. Purchases Table

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  payment_intent_id TEXT, -- Stripe or other payment processor ID
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id, status) -- Prevent duplicate purchases
);

-- Indexes
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_course_id ON purchases(course_id);
CREATE INDEX idx_purchases_status ON purchases(status);
```

### 4. User Progress Table

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  completed_chapters INTEGER DEFAULT 0,
  total_chapters INTEGER,
  progress_percentage DECIMAL(5, 2) DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
```

### 4a. Quiz Attempts Table

```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL, -- Percentage score
  correct_count INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL, -- User's answers: { questionId: answerId }
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_chapter_id ON quiz_attempts(chapter_id);
CREATE INDEX idx_quiz_attempts_course_id ON quiz_attempts(course_id);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at DESC);
```

### 5. Certificates Table

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url TEXT, -- URL to PDF in storage
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration
  verification_code TEXT UNIQUE, -- For certificate verification
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
```

### 6. Helper Functions

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔐 Authentication Configuration

### 1. Enable Email/Password Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - **Enable email confirmations**: Optional (recommended for production)
   - **Secure email change**: Enabled
   - **Double confirm email changes**: Enabled

### 2. Enable Social Providers (Optional)

1. **Google OAuth**:
   - Go to **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Add OAuth credentials from Google Cloud Console

2. **Other providers** (GitHub, Apple, etc.) can be added similarly

### 3. Email Templates

Customize email templates in **Authentication** → **Email Templates**:
- Confirm signup
- Magic link
- Change email address
- Reset password

---

## 🛡️ Row Level Security (RLS) Policies

### Enable RLS on All Tables

```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
```

### Courses Policies

```sql
-- Anyone can read courses
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

-- Only admins can insert/update/delete (create admin role later)
CREATE POLICY "Only admins can modify courses"
  ON courses FOR ALL
  USING (false); -- Will be updated when admin system is implemented
```

### Chapters Policies

```sql
-- Anyone can read chapters
CREATE POLICY "Chapters are viewable by everyone"
  ON chapters FOR SELECT
  USING (true);

-- Only admins can modify chapters
CREATE POLICY "Only admins can modify chapters"
  ON chapters FOR ALL
  USING (false);
```

### Purchases Policies

```sql
-- Users can only see their own purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own purchases
CREATE POLICY "Users can create own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot update/delete purchases (handled by system)
CREATE POLICY "Users cannot modify purchases"
  ON purchases FOR UPDATE
  USING (false);
```

### User Progress Policies

```sql
-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can create own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

### Quizzes Policies

```sql
-- Anyone can read quizzes (for course content)
CREATE POLICY "Quizzes are viewable by everyone"
  ON quizzes FOR SELECT
  USING (true);

-- Only admins can modify quizzes
CREATE POLICY "Only admins can modify quizzes"
  ON quizzes FOR ALL
  USING (false); -- Will be updated when admin system is implemented
```

### Quiz Attempts Policies

```sql
-- Users can view their own quiz attempts
CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own quiz attempts
CREATE POLICY "Users can create own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot update/delete quiz attempts (immutable records)
CREATE POLICY "Users cannot modify quiz attempts"
  ON quiz_attempts FOR UPDATE
  USING (false);
```

### Certificates Policies

```sql
-- Users can view their own certificates
CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert certificates (via service role)
-- Users cannot directly create certificates
```

---

## 📦 Storage Configuration

### 1. Create Storage Buckets

Go to **Storage** → **Buckets** and create:

#### `course-content` Bucket
- **Name**: `course-content`
- **Public**: No (private)
- **File size limit**: 50MB
- **Allowed MIME types**: `application/pdf`, `text/markdown`, `application/json`

#### `certificates` Bucket
- **Name**: `certificates`
- **Public**: Yes (for certificate verification)
- **File size limit**: 5MB
- **Allowed MIME types**: `application/pdf`, `image/png`, `image/jpeg`

#### `thumbnails` Bucket
- **Name**: `thumbnails`
- **Public**: Yes
- **File size limit**: 2MB
- **Allowed MIME types**: `image/png`, `image/jpeg`, `image/webp`

### 2. Storage Policies

```sql
-- Course content: Only authenticated users who purchased can access
CREATE POLICY "Users can access purchased course content"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'course-content' AND
    auth.uid() IN (
      SELECT user_id FROM purchases
      WHERE course_id::text = (storage.foldername(name))[1]
      AND status = 'completed'
    )
  );

-- Certificates: Public read, system write
CREATE POLICY "Certificates are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

-- Thumbnails: Public read
CREATE POLICY "Thumbnails are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');
```

---

## 🔧 Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: 
- Never commit `.env` to version control
- Add `.env` to `.gitignore`
- Use different keys for development and production

---

## 📝 Example Queries

### Fetch All Courses with Chapters

```javascript
const { data, error } = await supabase
  .from('courses')
  .select(`
    *,
    chapters (
      id,
      title,
      order_index,
      duration
    )
  `)
  .order('created_at', { ascending: false });
```

### Check if User Has Purchased Course

```javascript
const { data, error } = await supabase
  .from('purchases')
  .select('id')
  .eq('user_id', userId)
  .eq('course_id', courseId)
  .eq('status', 'completed')
  .single();
```

### Update Course Progress

```javascript
const { data, error } = await supabase
  .from('user_progress')
  .upsert({
    user_id: userId,
    course_id: courseId,
    completed_chapters: completedCount,
    total_chapters: totalCount,
    progress_percentage: (completedCount / totalCount) * 100,
    last_accessed_at: new Date().toISOString()
  })
  .select()
  .single();
```

### Fetch User's Purchased Courses

```javascript
const { data, error } = await supabase
  .from('purchases')
  .select(`
    *,
    courses (
      id,
      title,
      description,
      thumbnail_url
    )
  `)
  .eq('user_id', userId)
  .eq('status', 'completed')
  .order('created_at', { ascending: false });
```

### Generate Certificate (Server-side Function)

```javascript
// This would typically be a Supabase Edge Function or server-side code
const { data, error } = await supabase
  .from('certificates')
  .insert({
    user_id: userId,
    course_id: courseId,
    verification_code: generateVerificationCode(),
    issued_at: new Date().toISOString()
  })
  .select()
  .single();
```

---

## ✅ Testing Checklist

### Authentication
- [ ] User can sign up with email/password
- [ ] User receives confirmation email (if enabled)
- [ ] User can sign in
- [ ] User can sign out
- [ ] User session persists across page refreshes
- [ ] Protected routes redirect to login when not authenticated

### Courses
- [ ] All courses are visible to everyone
- [ ] Course details load correctly
- [ ] Chapters are displayed in correct order
- [ ] Course filtering by category works

### Purchases
- [ ] User can purchase a course
- [ ] Purchase is recorded in database
- [ ] User can only see their own purchases
- [ ] Purchased courses are unlocked

### Progress
- [ ] Progress is saved when user completes a chapter
- [ ] Progress percentage calculates correctly
- [ ] User can resume from last accessed chapter
- [ ] Progress is user-specific

### Certificates
- [ ] Certificate is generated when course is completed
- [ ] Certificate is downloadable
- [ ] Certificate verification code works
- [ ] Certificates are user-specific

### Storage
- [ ] Course content is accessible to purchasers only
- [ ] Certificates are publicly accessible
- [ ] Thumbnails load correctly
- [ ] File uploads work (for admin functions)

---

## 🚨 Security Best Practices

1. **Never expose service_role key** in client-side code
2. **Always use RLS policies** - don't rely on client-side filtering
3. **Validate user input** before database operations
4. **Use HTTPS** in production
5. **Implement rate limiting** for authentication endpoints
6. **Regularly audit RLS policies** for security gaps
7. **Monitor Supabase logs** for suspicious activity

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## 🔄 Next Steps

1. Run the SQL schema scripts in Supabase SQL Editor
2. Configure RLS policies
3. Set up storage buckets
4. Update environment variables
5. Test authentication flow
6. Test course purchase flow
7. Implement certificate generation
8. Set up payment processing (Stripe, etc.)

---

**Last Updated**: 2024-01-XX
**Version**: 1.0.0

