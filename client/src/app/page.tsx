"use client"
import { useState } from 'react';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-white/5 blur-3xl animate-pulse"></div>
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 shadow-2xl transition-all duration-500 hover:bg-zinc-900/70 hover:shadow-white/10 hover:shadow-3xl hover:border-zinc-700">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          
          <div className="relative p-8">
            {/* Logo with glow effect */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                  <FileText className="h-10 w-10 text-black" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="mb-2 text-center">
              <h1 className="mb-1 text-4xl font-bold text-white">
                FileSure
              </h1>
              <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-300">
                <Sparkles className="h-4 w-4" />
                <span>Referral System</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            {/* Subtitle */}
            <p className="mb-8 text-center text-sm font-medium text-gray-400">
              Full-Stack Intern Assignment
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-4">
              {/* Login Button */}
              <a
                href="/login"
                onMouseEnter={() => setHoveredButton('login')}
                onMouseLeave={() => setHoveredButton(null)}
                className="group/btn relative overflow-hidden rounded-xl bg-white px-6 py-4 font-semibold text-black shadow-lg transition-all duration-300 hover:shadow-white/30 hover:shadow-xl hover:scale-[1.02] block text-center"
              >
                <div className="absolute inset-0 bg-gray-100 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span>Login</span>
                  <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${hoveredButton === 'login' ? 'translate-x-1' : ''}`} />
                </div>
              </a>

              {/* Register Button */}
              <a
                href="/register"
                onMouseEnter={() => setHoveredButton('register')}
                onMouseLeave={() => setHoveredButton(null)}
                className="group/btn relative overflow-hidden rounded-xl border-2 border-zinc-700 bg-zinc-900/50 px-6 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-800/50 hover:scale-[1.02] block text-center"
              >
                <div className="relative flex items-center justify-center gap-2">
                  <span>Register</span>
                  <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${hoveredButton === 'register' ? 'translate-x-1' : ''}`} />
                </div>
              </a>
            </div>

            {/* Bottom accent line */}
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-20 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Secure • Reliable • Innovative
        </p>
      </div>
    </div>
  );
}