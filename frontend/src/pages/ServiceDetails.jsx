import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceById } from "../api/services.api";
import { Link } from "react-router-dom";

function ServiceDetails() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const result = await getServiceById(id);
        setService(result.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading service...</p>
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

  if (!service) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Service information */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-medium text-blue-600">
            {service.category}
          </p>

          <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>

          <p className="mt-4 text-gray-600">{service.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Fee</p>
              <p className="mt-1 font-semibold text-gray-900">{service.fee}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Processing Time</p>
              <p className="mt-1 font-semibold text-gray-900">
                {service.processingTime}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Delivery Mode</p>
              <p className="mt-1 font-semibold text-gray-900">
                {service.deliveryMode}
              </p>
            </div>
          </div>

          {service.officialUrl && (
            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Visit Official Website
            </a>
          )}

          <Link
            to={`/services/${service._id}/eligibility`}
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Check Eligibility
          </Link>

          <Link
            to={`/services/${service._id}/journey`}
            className="mt-3 ml-3 inline-block rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50"
          >
            View Service Journey
          </Link>
        </section>

        {/* Required documents */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Required Documents
          </h2>

          <div className="mt-4 space-y-3">
            {service.requiredDocuments?.map((document) => (
              <div
                key={document._id}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {document.label.en}
                    </h3>

                    {document.notes?.en && (
                      <p className="mt-1 text-sm text-gray-500">
                        {document.notes.en}
                      </p>
                    )}
                  </div>

                  {document.mandatory && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                      Required
                    </span>
                  )}
                </div>
              </div>
            ))}

            {service.requiredDocuments?.length === 0 && (
              <p className="text-gray-500">No documents listed.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ServiceDetails;
