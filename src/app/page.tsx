// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
      <p className="text-lg mb-8">This is a public homepage.</p>
      <Link
        href="/dashboard"
        className="bg-white text-blue-500 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}