// @/app/login/page.tsx
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";

export default async function Loginpage (){
  return (
    <main>
      <Header/>
      <LoginForm/>
    </main>
  );
}