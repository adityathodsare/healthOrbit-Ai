"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function FitnessResponse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activityId");
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

    if (!activityId) {
      setError(new Error("No activity ID provided"));
      setIsLoading(false);
      toast.error("No activity ID found");
      return;
    }

    const fetchRecommendation = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await fetch(
          `http://localhost:8083/recommendation/activity/${activityId}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Recommendations not ready yet. Please check back later."
              : "Failed to fetch recommendations"
          );
        }

        const data = await response.json();
        setRecommendation(data);
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setError(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [activityId, router]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">
            {isLoading ? "Loading recommendations..." : "Verifying session..."}
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
              Error Loading Recommendations
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
        <title>Recommendations | HealthOrbit.Ai</title>
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
              Your AI Recommendations
            </h1>
            <p className="text-gray-400 mt-2">
              Activity ID:{" "}
              <span className="font-mono text-cyan-400">{activityId}</span>
            </p>
          </div>

          {recommendation ? (
            <div className="space-y-8">
              {recommendation.suggestions?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Suggestions
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">•</span>
                        <span className="text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendation.safetyMeasures?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Safety Measures
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.safetyMeasures.map((measure, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">•</span>
                        <span className="text-gray-300">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendation.improvements?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Improvements
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">•</span>
                        <span className="text-gray-300">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(recommendation.postWorkout?.length > 0 ||
                recommendation.hydration?.length > 0 ||
                recommendation.supplements?.length > 0) && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Nutrition Plan
                  </h2>

                  {recommendation.postWorkout?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-purple-400 mb-2">
                        Post-Workout
                      </h3>
                      <ul className="space-y-2">
                        {recommendation.postWorkout.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-400 mr-2">•</span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendation.hydration?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-purple-400 mb-2">
                        Hydration
                      </h3>
                      <ul className="space-y-2">
                        {recommendation.hydration.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-400 mr-2">•</span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendation.supplements?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-400 mb-2">
                        Supplements
                      </h3>
                      <ul className="space-y-2">
                        {recommendation.supplements.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-400 mr-2">•</span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {recommendation.moreRecommendations?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                    Additional Recommendations
                  </h2>
                  <ul className="space-y-2">
                    {recommendation.moreRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">•</span>
                        <span className="text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No recommendations found for this activity.
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
