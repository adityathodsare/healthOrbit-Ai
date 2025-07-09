"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ACTIVITY_TYPES = [
  "WALKING",
  "RUNNING",
  "CYCLING",
  "SWIMMING",
  "YOGA",
  "WEIGHT_TRAINING",
  "STRENGTH_TRAINING",
  "CARDIO",
  "STRETCHING",
  "OTHER",
];

export default function FitnessTracking() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [additionalMetrics, setAdditionalMetrics] = useState([
    { key: "", value: "" },
  ]);

  const [formData, setFormData] = useState({
    activityType: "",
    duration: "",
    caloriesBurned: "",
    startTime: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    const userData = localStorage.getItem("healthOrbitUser");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleMetricChange = (index, field, value) => {
    const updatedMetrics = [...additionalMetrics];
    updatedMetrics[index][field] = value;
    setAdditionalMetrics(updatedMetrics);
  };

  const addMetricField = () => {
    setAdditionalMetrics([...additionalMetrics, { key: "", value: "" }]);
  };

  const removeMetricField = (index) => {
    if (additionalMetrics.length > 1) {
      const updatedMetrics = [...additionalMetrics];
      updatedMetrics.splice(index, 1);
      setAdditionalMetrics(updatedMetrics);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (
        !formData.activityType ||
        !formData.duration ||
        !formData.caloriesBurned ||
        !formData.startTime
      ) {
        throw new Error("Please fill all required fields");
      }

      const metricsObj = {};
      additionalMetrics.forEach((metric) => {
        if (metric.key && metric.value) {
          metricsObj[metric.key] = isNaN(metric.value)
            ? metric.value
            : Number(metric.value);
        }
      });

      const payload = {
        userId: user.id,
        activityType: formData.activityType,
        duration: Number(formData.duration),
        caloriesBurned: Number(formData.caloriesBurned),
        startTime: formData.startTime,
        additionalMatrices:
          Object.keys(metricsObj).length > 0 ? metricsObj : null,
      };

      const response = await fetch("http://localhost:8082/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.id,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.id) {
        throw new Error("No activity ID received in response");
      }

      toast.success("Activity tracked successfully!");
      router.push(`/fitness-response?activityId=${data.id}`);

      setFormData({
        activityType: "",
        duration: "",
        caloriesBurned: "",
        startTime: new Date().toISOString().slice(0, 16),
      });
      setAdditionalMetrics([{ key: "", value: "" }]);
    } catch (err) {
      console.error("Error:", err);
      setError(err);
      toast.error(err.message || "Failed to track activity");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Track Fitness | HealthOrbit.Ai</title>
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Track Your Activity
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 font-medium">Error: {error.message}</p>
              <p className="text-red-300 text-sm mt-1">
                Please check your inputs and try again.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="activityType"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Activity Type *
                </label>
                <select
                  id="activityType"
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Select an activity</option>
                  {ACTIVITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="caloriesBurned"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Calories Burned *
                </label>
                <input
                  type="number"
                  id="caloriesBurned"
                  name="caloriesBurned"
                  min="1"
                  value={formData.caloriesBurned}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Metrics
                </label>
                {additionalMetrics.map((metric, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Metric name"
                      value={metric.key}
                      onChange={(e) =>
                        handleMetricChange(index, "key", e.target.value)
                      }
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={metric.value}
                      onChange={(e) =>
                        handleMetricChange(index, "value", e.target.value)
                      }
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeMetricField(index)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMetricField}
                  className="mt-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30"
                >
                  Add Another Metric
                </button>
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
                    Tracking Activity...
                  </>
                ) : (
                  "Track Activity"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
