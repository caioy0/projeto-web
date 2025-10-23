// @/app/active/page.tsx
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
        </main>
    );
}
