// src/app/login/page.tsx

import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className='p-6'>
      <Header></Header>
      <div className="min-h-screen flex items-center justify-center bg-grey-500">
        <div className="p-8 bg-black rounded shadow w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <LoginForm onSuccessRedirect="/dashboard" />
        </div>
      </div>
    </div>
  );
}
