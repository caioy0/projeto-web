// @/app/active/page.tsx

import Active from "@/components/Confirm/Active";
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
        </main>
    );
}