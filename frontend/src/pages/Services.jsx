import { useEffect, useState } from "react";
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
    <div>
      <h1>Government Services</h1>

      {services.map((service) => (
        <div key={service._id}>
          <h2>{service.title}</h2>
          <p>{service.description}</p>
          <p>Category: {service.category}</p>
          <p>Fee: {service.fee}</p>
          <p>Processing time: {service.processingTime}</p>
        </div>
      ))}
    </div>
  );
}

export default Services;