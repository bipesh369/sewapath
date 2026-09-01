import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJourneySteps } from "../api/journey.api";

function Journey() {
  const { id } = useParams();

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await getJourneySteps(id);
        setSteps(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load journey"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading journey...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">

        <h1 className="text-3xl font-bold text-gray-900">
          Service Journey
        </h1>

        <p className="mt-2 text-gray-600">
          Follow these steps to complete the service.
        </p>

        <div className="mt-8 space-y-6">
          {steps.map((step, index) => (
            <div
              key={step._id}
              className="relative rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {step.instructions}
                  </p>

                  {step.estimatedTime && (
                    <p className="mt-3 text-sm text-gray-500">
                      Estimated time:{" "}
                      {step.estimatedTime}
                    </p>
                  )}

                  {step.responsibleOffice && (
                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-500">
                        Responsible Office
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {step.responsibleOffice.name?.en}
                      </p>

                      <p className="text-sm text-gray-600">
                        {step.responsibleOffice.address}
                      </p>

                      {step.responsibleOffice.phone && (
                        <p className="mt-1 text-sm text-gray-600">
                          {step.responsibleOffice.phone}
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {steps.length === 0 && (
          <p className="mt-8 text-gray-500">
            No journey steps available.
          </p>
        )}

      </div>
    </main>
  );
}

export default Journey;