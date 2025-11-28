// @/app/login/page.tsx
import LoginForm from "@/components/Forms/LoginForm";
import Header from "@/components/Header";

export default async function Loginpage (){
  return (
    <main>
      <div>
        <Header/>
      </div>
      <div>
        <LoginForm/>
      </div>
    </main>
  );
}