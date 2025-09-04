// src/app/login/page.tsx
//import { loginUser } from '../actions';

// This is a Server Component by default. No 'use client'!
export default async function LoginPage() {
  // You can do server-side work here, like checking if the user is already authenticated
  // const session = await getSession();
  // if (session) { redirect('/dashboard'); }

  // This function handles the form submission. It runs on the server.
  // async function handleLogin(formData: FormData) {
  //   'use server'; // You can also define the action inline with 'use server'
  //   await loginUser(formData);
  // }

  return (
    <div className="">
      <h1>Login</h1>
      {/* The form calls the Server Action directly */}
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit">Log in</button>
      </form>

      <p>
        Don t have an account? <a href="/register">Register here</a>.
      </p>
    </div>
  );
}