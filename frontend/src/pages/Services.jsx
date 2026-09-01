import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import getServices from "../api/services.api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await getServices();
        setServices(result.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <p>Loading services...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Government Services
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              to={`/services/${service._id}`}
              key={service._id}
              className="block rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {service.title}
              </h2>

              <p className="mb-4 text-gray-600">
                {service.description}
              </p>

              <p className="mb-2 text-sm text-gray-500">
                Category: {service.category}
              </p>

              <p className="mb-2 text-sm text-gray-500">
                Fee: {service.fee}
              </p>

              <p className="text-sm text-gray-500">
                Processing time: {service.processingTime}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;