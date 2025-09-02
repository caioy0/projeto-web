// src/components/Auth/AuthCards.tsx

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}