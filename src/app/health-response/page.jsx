"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function HealthResponse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [user, setUser] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("healthOrbitUser");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    if (!recordId) {
      setError(new Error("No record ID provided"));
      setIsLoading(false);
      toast.error("No health record ID found");
      return;
    }

    const fetchRecommendation = async () => {
      try {
        // Add 5-second delay before making the request
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const response = await fetch(
          `http://localhost:8083/api/health-recommendations/analysis/${recordId}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Recommendations not ready yet. Please check back later."
              : "Failed to fetch health recommendations"
          );
        }

        const data = await response.json();
        if (data.length > 0) {
          setRecommendation(data[0]); // Get the first recommendation
        } else {
          throw new Error("No recommendations found for this record");
        }
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setError(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [recordId, router]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">
            {isLoading
              ? "Generating your health recommendations (this may take a few seconds)..."
              : "Verifying session..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Error | HealthOrbit.Ai</title>
        </Head>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <h2 className="text-xl font-bold text-red-400">
              Error Loading Health Recommendations
            </h2>
            <p className="mt-2 text-red-300">{error.message}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Health Recommendations | HealthOrbit.Ai</title>
      </Head>

      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                HealthOrbit.Ai
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.firstName}</span>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-3 py-1 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg"
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Your AI Health Recommendations
            </h1>
            <p className="text-gray-400 mt-2">
              Record ID:{" "}
              <span className="font-mono text-cyan-400">{recordId}</span>
            </p>
          </div>

          {recommendation ? (
            <div className="space-y-8">
              {recommendation.possibleConditions?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Possible Conditions
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.possibleConditions.map(
                      (condition, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          <span className="text-gray-300">{condition}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {recommendation.recommendedActions?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Recommended Actions
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">•</span>
                        <span className="text-gray-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendation.dietarySuggestions?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Dietary Suggestions
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.dietarySuggestions.map(
                      (suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          <span className="text-gray-300">{suggestion}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {recommendation.lifestyleChanges?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Lifestyle Changes
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.lifestyleChanges.map((change, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">•</span>
                        <span className="text-gray-300">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendation.preferredMedicines?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Preferred Medicines
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.preferredMedicines.map(
                      (medicine, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          <span className="text-gray-300">{medicine}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {recommendation.whenToSeeDoctor?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    When to See a Doctor
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.whenToSeeDoctor.map((warning, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">•</span>
                        <span className="text-gray-300">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No health recommendations found for this record.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-4 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
