# Daymark

A calm MERN activity log for recording time, identifying unwanted patterns,
reflecting on each day, and receiving personalized productivity suggestions.

## Run locally

1. Open `server/.env` and replace the example `MONGODB_URI` with your Atlas
   connection string. Replace `JWT_SECRET` with a long private phrase too.
2. From this folder, run:

```powershell
npm install
npm run dev
```

3. Open `http://localhost:5173`.

If `node` is not recognized immediately after installation, completely close and
reopen Codex (or Windows Terminal) so it receives the updated PATH.

## MongoDB Atlas checklist

- Create a free cluster if you do not already have one.
- In **Database Access**, create a database user.
- In **Network Access**, allow your current IP address.
- Choose **Connect → Drivers → Node.js** and copy the connection string.
- Replace `<password>` locally inside `server/.env`. Do not commit or share it.
