// @/app/active/page.tsx
<<<<<<< HEAD
import ActiveAccount from "@/components/ActiveAccount";
import { Suspense } from 'react';

export default function ActivePage() {
    return (
        <main>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Suspense fallback={<p>Carregando página de ativação...</p>}>
                    <ActiveAccount />
                </Suspense>
            </div>
=======

import Active from "@/components/Forms/Active";
import Header from "@/components/Header";
import { Suspense } from 'react';

export default async function ActivePage(){
    return (
        <main>
            <div className="">
                <Header/>
            </div>
            <div>
                <Suspense fallback={<p>Carregando página de ativação...</p>}>
                    <Active/>
                </Suspense>
            </div>
>>>>>>> prod
        </main>
    );
}
