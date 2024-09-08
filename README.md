
# Decolonization of Social Sciences Documentation


# Origin of DSSP

A family friend reached out with a vision to create a platform that could bring together minds from around the world. Through brainstorming and collaboration, this concept evolved into the application you see today.
# Technologies
Frontend: Next.js, React.js, TypeScript, React Mapbox, TailwindCSS, ShadCN, Aceternity UI  

Backend: Next.js, PostgreSQL, Supabase  

Authentication: NextAuth, Google OAuth, Supabase

Hosting + CI/CD: Vercel

TODO: Implement unit testing with Vitest / Jest
TODO: Clean up code components and make code more readable (create util components for most activities within the map component)
TODO: Adopt Typescript clean code and best code practices for React


# Development Process
The journey from idea to reality involved several key processes. Initially, we focused on actualizing the concept by determining how to implement functionality that connects users. This included gathering input and conducting tests with a diverse group of individuals, followed by continuous refinement based on their feedback and experiences.

# Our Achievement
We're proud to present an application that we believe truly embodies our initial vision. It represents not just technological innovation, but a step towards creating a more inclusive and diverse approach to social sciences. We invite you to explore, engage, and contribute to this growing global community!

# https://dssp.app

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app -e with-supabase
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
