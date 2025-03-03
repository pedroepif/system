# Base Full Stack Setup

This is a full stack setup for developing web applications using Next.Js.

## What's included?

The main goal of this base setup is to be a simple way to start web application development using Next.Js and some other cool stacks, provinding:

- User Authentication: a full setup to Sign In, Sign Up, Forgot Password and Reset Password.
- Internationalization: multiple language support.
- Multiple Company: a system with multiple companies, providing SaaS support.


For this base setup we are using:

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn](https://ui.shadcn.com)
- [Nodemailer](https://www.nodemailer.com)
- [Zod](https://zod.dev)
- [Next-Intl](https://next-intl.dev)
- [Lucia Auth](https://lucia-auth.com)

## End-to-end typesafe

This project is design to use a end-to-end typesafe design, using only Zod Schemas and Type. Every API route has a type, a route and a action. We can use the actions to call the route inside the frontend already typed.

## How to deploy?

There is a Dockerfile already defined to build and run the Next.Js project with all necessary dependencies! Or you can just use the standards Next.Js commands to run the application.