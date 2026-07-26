# 🔗 [Landr](https://ai-job-preparation.vercel.app)

## Overview

Landr is a AI Job Preparation platform that allows users to conduct mock interviews, practice answering technical interview questions, and analyze their resume all with the help of AI. The platform comes with different subscriptions allowing users to upgrade and adjust their plans based on their usage.

## What It Does

Some of the main features are:

- All features scoped to a certain job
- AI mock interviews
- AI technical interview questions
- AI interview feedback
- AI Q/A feedback
- Full markdown support
- Comprehensive resume analysis
- Different subscriptions depending on usage
- Profile management and history

## About the project

I built this project by following along from a tutorial on YouTube. I wanted to learn some different skills like AI features, auth, billing, and Next.js caching so I thought that this would be a great way to do so.

## Try it out!

Go to the [Landr](https://ai-job-preparation.vercel.app) website, hosted on Vercel.

## How to Use

You can visit the website and create an account. Once signed in, you will be able to use all the features. The free plan limits your access to certain features. Upgrading to a paid plan unlocks more usage and features.

If you would rather run this locally, I have instructions below.

## Tech Stack

- Next.js with React & Typescript
- Neon for DB and Drizzle as the ORM
- Clerk for secure, easy authentication and payment integration
- Tailwind CSS for styling and Shadcn UI for easy-to-edit and reusable components
- React Hook Form handles easy form input field management and Zod handles form validation and input validation
- Arcjet protects application from common threats and attacks
- AI SDK for AI features and OpenRouter/Google for the AI providers
- React Markdown for clean markdown rendering
- Hume for AI voice integration
- NPM as the package manager

## Components / Dependencies

To run this project you will need a few things setup:

- Node.js (At least version 20.9, check the Next.js docs for more information)
- Git (To clone the repo to your local machine)

## Setup Instructions

### 1. Install Node.js (Skip if you already have installed)

Go to the [Node.js website](https://nodejs.org/en) and follow the installation instructions there to install it on your machine. To verify it is working, you can enter the following command:

```bash
node --version
npm --version
```

If both commands run successfully and print out version numbers with no "not found" errors, then you are good to go.

### 2. Install Git (If not already installed)

Go to the [Git website](https://git-scm.com) and follow the installation instructions there to install it on your system (if you don't already have it).

Then run the following command to verify that it works:

```bash
git --version
```

If no errors are raised, then you are good to continue.

### 3. Clone the Repo!

To clone, run:

```bash
git clone https://github.com/Danieldkdao/ai-job-preparation.git
cd ai-job-preparation
npm install
```

Once finished, open the project in your favorite IDE or code editor.

## Configuration

Because the project uses @t3-oss/env-nextjs for environment variables, it will throw an error if you try to run the application without any of the following variables in an .env file at the root of the application:

```text
// .env

# Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

# Arcjet
ARCJET_KEY=

# Local Database
DB_PASSWORD=
DB_USER=
DB_HOST=
DB_PORT=
DB_NAME=

# Neon
DATABASE_URL=

# Hume
HUME_API_KEY=
HUME_SECRET_KEY=
NEXT_PUBLIC_HUME_CONFIG_ID=

# Gemini
GEMINI_API_KEY=

```

## Running the Project

To start the project locally, simply run:

```bash
npm db:push
npm dev
```

To confirm that the project is running successfully, you can go to [localhost:3000](http://localhost:3000) in your browser. If you see the landing page, then it worked!

To build the project for production, you can run:

```bash
npm build
```

See the package.json for more information.

## License

This project is licensed under the MIT license.
