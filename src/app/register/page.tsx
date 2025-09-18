// @/app/register/page.tsx
import Header from "@/components/Header";
import RegisterForm from "@/components/RegisterForm";

export default async function RegisterPage(){
  return (
    <main>
      <Header/>
      <RegisterForm></RegisterForm>
    </main>
  );
}