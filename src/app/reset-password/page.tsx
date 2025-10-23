import { Suspense } from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando formulário...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
