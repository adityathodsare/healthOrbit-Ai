"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const isValid = await response.json();
      if (isValid) {
        // On successful login, redirect to dashboard
        router.push("/dashboard");
      } else {
        setErrors({ server: "Invalid email or password" });
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        server: err.message || "Login failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <Head>
        <title>Login | HealthOrbit.Ai</title>
        <meta
          name="description"
          content="Sign in to your HealthOrbit.Ai account"
        />
      </Head>

      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen relative z-10">
        <motion.section
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to your HealthOrbit.Ai account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-lg"
          >
            {errors.server && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
                {errors.server}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>

            <div className="mt-4 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Register
              </button>
            </div>
          </form>
        </motion.section>
      </main>
    </div>
  );
}
