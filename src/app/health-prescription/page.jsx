"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const COMMON_SYMPTOMS = [
  "Fever",
  "Headache",
  "Cough",
  "Fatigue",
  "Nausea",
  "Dizziness",
  "Shortness of breath",
  "Chest pain",
  "Muscle pain",
  "Sore throat",
  "Runny nose",
  "Diarrhea",
  "Abdominal pain",
  "Joint pain",
  "Rash",
];

export default function HealthPrescription() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    symptoms: [],
    age: "",
    weight: "",
    additionalNotes: "",
    customSymptom: "",
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

  const handleSymptomToggle = (symptom) => {
    setFormData((prev) => {
      if (prev.symptoms.includes(symptom)) {
        return {
          ...prev,
          symptoms: prev.symptoms.filter((s) => s !== symptom),
        };
      } else {
        return {
          ...prev,
          symptoms: [...prev.symptoms, symptom],
        };
      }
    });
  };

  const addCustomSymptom = () => {
    if (
      formData.customSymptom.trim() &&
      !formData.symptoms.includes(formData.customSymptom.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...prev.symptoms, prev.customSymptom.trim()],
        customSymptom: "",
      }));
    }
  };

  const removeSymptom = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.filter((s) => s !== symptom),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.symptoms.length || !formData.age || !formData.weight) {
        throw new Error("Please fill all required fields");
      }

      const payload = {
        userId: user.id,
        symptoms: formData.symptoms,
        age: Number(formData.age),
        weight: Number(formData.weight),
        additionalNotes: formData.additionalNotes || null,
      };

      const response = await fetch(
        "http://localhost:8084/healthcare/symptoms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user.id,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.id) {
        throw new Error("No symptom record ID received in response");
      }

      toast.success(
        "Symptoms recorded successfully! Generating recommendations..."
      );
      router.push(`/health-response?recordId=${data.id}`);
    } catch (err) {
      console.error("Error:", err);
      setError(err);
      toast.error(err.message || "Failed to record symptoms");
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
        <title>Health Prescription | HealthOrbit.Ai</title>
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
            Health Prescription
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Symptoms *
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COMMON_SYMPTOMS.map((symptom) => (
                    <button
                      type="button"
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.symptoms.includes(symptom)
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>

                <div className="flex mt-4">
                  <input
                    type="text"
                    placeholder="Add custom symptom"
                    value={formData.customSymptom}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customSymptom: e.target.value,
                      }))
                    }
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addCustomSymptom}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-r-lg hover:bg-cyan-500/30"
                  >
                    Add
                  </button>
                </div>

                {formData.symptoms.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">
                      Selected Symptoms:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.symptoms.map((symptom) => (
                        <div
                          key={symptom}
                          className="flex items-center bg-gray-700 px-3 py-1 rounded-full"
                        >
                          <span>{symptom}</span>
                          <button
                            type="button"
                            onClick={() => removeSymptom(symptom)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    min="1"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="additionalNotes"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows="3"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Any other symptoms, duration, severity, etc."
                ></textarea>
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
                    Analyzing Symptoms...
                  </>
                ) : (
                  "Get Health Recommendations"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
