// src/app/settings/page.tsx

import UserConfig from "@/components/UserSettings/UserConfig";
import Header from "@/components/Header";

export default async function UserSettingPage (){
  return (
    <main>
      <div>
        <Header/>
      </div>
      <UserConfig/>
    </main>
  );
}