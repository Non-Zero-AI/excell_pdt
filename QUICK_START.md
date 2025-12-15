# 🚀 Quick Start Guide - Excell PDT

Get your Excell PDT app running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A Supabase account (optional for initial development)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment (Optional)

If you have Supabase set up:

1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

**Note**: The app works without Supabase using mock data for development!

## Step 3: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Step 4: Test the App

### Without Supabase (Mock Mode)
- ✅ Browse courses on the home page
- ✅ View course details
- ✅ Test UI components and navigation
- ⚠️ Authentication is mocked (no real login)
- ⚠️ Purchases are simulated

### With Supabase (Full Features)
1. Follow the [Supabase Wiring Guide](./supabase_wiring_guide.md)
2. Set up database schema
3. Configure authentication
4. Test full authentication and purchase flows

## Common Issues

### Port Already in Use
If port 3000 is busy, Vite will automatically use the next available port.

### Module Not Found
Run `npm install` again to ensure all dependencies are installed.

### Supabase Connection Errors
- Check your `.env` file has correct credentials
- Verify Supabase project is active
- Check network connectivity

## Next Steps

1. **Set up Supabase** - See `supabase_wiring_guide.md`
2. **Upload Course Content** - Parse your Word documents into structured data
3. **Configure Payments** - Integrate Stripe or another payment processor
4. **Deploy to Vercel** - Push to GitHub and connect to Vercel

## Development Tips

- **Hot Reload**: Changes auto-refresh in the browser
- **Dark Mode**: Toggle in the header (saves preference)
- **Mock Data**: Located in `src/utils/mockData.js`
- **Components**: Reusable components in `src/components/`

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review [supabase_wiring_guide.md](./supabase_wiring_guide.md) for backend setup
- Open an issue in the repository

---

Happy coding! 🎉

