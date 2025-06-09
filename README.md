<h1 align="center">MORPH</h1>

<p align="center">
  <i>Build Stunning Websites with No-Code Simplicity</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-june-2ea44f?style=flat-square" />
  <img src="https://img.shields.io/badge/typescript-90%25-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/languages-3-lightgrey?style=flat-square" />
</p>

---

### 🔧 Built with the tools and technologies:

<p>
  <img src="https://img.shields.io/badge/JSON-black?logo=json&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Markdown-black?logo=markdown&style=for-the-badge" />
  <img src="https://img.shields.io/badge/npm-red?logo=npm&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Prettier-f7b93e?logo=prettier&style=for-the-badge" />
  <img src="https://img.shields.io/badge/.ENV-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/JavaScript-yellow?logo=javascript&style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Lodash-3492FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&style=for-the-badge" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?logo=socketdotio&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React_DnD-61DAFB?logo=react&style=for-the-badge" />
</p>

---

## ✨ Features

- **Drag-and-Drop Builder** – Intuitive interface for creating websites without coding.
- **Real-Time Collaboration** – Powered by Socket.IO for seamless team editing.
- **Customizable Templates** – Pre-built designs with Tailwind CSS styling.
- **User Authentication** – Secure sign-in with NextAuth.js.
- **Dynamic Content** – Manage content with Prisma and MongoDB.
- **Animations** – Smooth transitions using Framer Motion.
- **Analytics** – Track site performance with Vercel Analytics.
- **State Management** – Efficient client-side state handling with Zustand.

---

## 📦 Technologies Used

| Category        | Technologies                                                                 |
|----------------|-------------------------------------------------------------------------------|
| **Frontend**    | Next.js 15, React, Tailwind CSS, Framer Motion, React DnD, React Icons        |
| **Backend**     | Node.js, Prisma ORM, Socket.IO                                               |
| **Database**    | MongoDB (via Prisma)                                                         |
| **Auth**        | NextAuth.js                                                                  |
| **State**       | Zustand                                                                      |
| **Analytics**   | Vercel Analytics                                                             |
| **Utils**       | Lodash, Bcrypt, BSON-ObjectID                                                |
| **CI/Formatting**| ESLint, Prettier, TailwindCSS PostCSS                                       |

---

# Getting Started

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```


# Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.js. The page auto-updates as you edit the file.

Set up the environment variables by creating a .env.local file at the root of the project:


```bash
GOOGLE_ID=your-google-id
GOOGLE_SECRET=your-google-secret
NODE_ENV=development
COOKIE_SECRET=your-cookie-secret
DATABASE_URL="your-mongodb-connection-string"
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```



### Notes

- **Structure**: Mirrors FLARE’s README with `<h1>` for the title, `<p>` tags for badges, emoji headers, and a tech table. I excluded the testing section since Jest isn’t in Morph’s `package.json`, and there’s no Stripe checkout, so I omitted that part.
- **Badges**: Includes all relevant technologies from `package.json` (e.g., Next.js, Prisma, Socket.IO, Zustand) with shields.io badges, styled like FLARE’s.
- **Features**: Tailored to a no-code website builder, emphasizing drag-and-drop (React DnD), real-time collaboration (Socket.IO), and animations (Framer Motion).
- **Environment Variables**: Adapted from FLARE’s `.env` example, focusing on NextAuth.js and MongoDB, as they’re implied by the dependencies.
- **Placeholders**: Replace `your-google-id`, `your-mongodb-connection-string`, etc., with your actual values.
- **Assumptions**: Assumed Next.js 15 uses the app router (`app/page.js`). If Morph uses the pages router or has specific features, let me know to adjust.

### Next Steps
- **Copy-Paste**: You can copy the above Markdown directly into your project’s `README.md` file.
- **Customization**: If you want to add specific features, screenshots, or a live demo link, let me know.
- **Profile README**: If you’re ready to update your GitHub profile README, share your current one or confirm if you want to use the earlier suggestion, and I’ll integrate Morph.
- **Feedback**: If you need changes (e.g., more badges, different tone, or additional sections like testing), please specify.



