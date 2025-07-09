"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("healthOrbitToken");
    const userData = localStorage.getItem("healthOrbitUser");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("healthOrbitToken");
    localStorage.removeItem("healthOrbitUser");
    router.push("/login");
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Dashboard | HealthOrbit.Ai</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                HealthOrbit.Ai
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-gray-300">
                  Welcome, {user?.firstName || "User"}
                </p>
                <p className="text-xs text-gray-500">ID: {user?.id}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              {user?.firstName}
            </span>
          </h1>
          <p className="text-gray-400 mb-4">User ID: {user?.id}</p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access your personalized health and fitness dashboard
          </p>
        </div>

        {/* Rest of your existing dashboard content... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Fitness Tracking Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-lg cursor-pointer"
            onClick={() => navigateTo("/fitness-tracking")}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-cyan-500/10 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Track Fitness</h2>
              </div>
              <p className="text-gray-400">
                Monitor your workouts, track progress, and analyze your fitness
                journey with detailed statistics.
              </p>
            </div>
            <div className="bg-gray-700/50 px-6 py-3 text-sm font-medium text-cyan-400">
              Get started →
            </div>
          </motion.div>

          {/* Health Prescription Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-lg cursor-pointer"
            onClick={() => navigateTo("/health-prescription")}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-500/10 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">
                  Health Prescription by AI
                </h2>
              </div>
              <p className="text-gray-400">
                Get personalized health recommendations powered by our advanced
                artificial intelligence system.
              </p>
            </div>
            <div className="bg-gray-700/50 px-6 py-3 text-sm font-medium text-purple-400">
              Try it now →
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
