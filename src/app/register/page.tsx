// @/app/register/page.tsx
import Header from "@/components/Header";
import RegisterForm from "@/components/Forms/RegisterForm";

export default async function RegisterPage(){
  return (
    <main>
      <div>
        <Header/>
      </div>
      <div>
        <RegisterForm/>
      </div>
    </main>
  );
}