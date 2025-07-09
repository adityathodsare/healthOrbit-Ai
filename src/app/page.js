"use client";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <Head>
        <title>HealthOrbit.Ai - Your Smart Health Companion</title>
        <meta
          name="description"
          content="Track fitness and get personalized health insights"
        />
      </Head>

      {/* Animated background elements */}
      {isMounted && (
        <>
          <motion.div
            className="absolute top-10 left-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"
            initial={{ x: -100, y: -100 }}
            animate={{ x: 0, y: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl"
            initial={{ x: 100, y: 100 }}
            animate={{ x: 0, y: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </>
      )}

      <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen relative z-10">
        <motion.section
          className="text-center max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated Title */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400"
            variants={itemVariants}
          >
            HealthOrbit.Ai
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg mx-auto"
            variants={itemVariants}
          >
            Your intelligent health companion for fitness tracking and
            personalized wellness insights
          </motion.p>

          {/* Feature Cards with Hover Effects */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
          >
            {[
              {
                icon: "📊",
                title: "Track Progress",
                description:
                  "Monitor your fitness journey with detailed analytics",
                color: "cyan",
              },
              {
                icon: "💡",
                title: "Get Insights",
                description: "Receive personalized health recommendations",
                color: "purple",
              },
              {
                icon: "⚕️",
                title: "Health Support",
                description: "Guidance for common health concerns",
                color: "emerald",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-${feature.color}-400 transition-all duration-300 hover:shadow-lg hover:shadow-${feature.color}-500/10 hover:-translate-y-2 cursor-default`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-${feature.color}-400 text-3xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated CTA Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => router.push("/register")}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-cyan-500/30 relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute top-0 left-0 w-full h-0.5 bg-white/30 group-hover:h-full group-hover:bg-white/10 transition-all duration-500"></span>
            </button>
          </motion.div>

          {/* Secondary Option */}
          <motion.p className="mt-8 text-gray-400" variants={itemVariants}>
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Sign in
            </button>
          </motion.p>
        </motion.section>
      </main>

      <motion.footer
        className="py-6 text-center text-gray-500 text-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>
          © {new Date().getFullYear()} HealthOrbit.Ai - Your Health Companion
        </p>
      </motion.footer>
    </div>
  );
}
