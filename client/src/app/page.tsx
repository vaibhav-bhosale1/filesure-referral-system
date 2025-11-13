import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">
        FileSure Referral System
      </h1>
      <p className="mb-8 text-lg text-gray-400">
        The Full-Stack Intern Assignment [cite: 1]
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-border bg-card px-4 py-2"
        >
          Register
        </Link>
      </div>
    </div>
  );
}