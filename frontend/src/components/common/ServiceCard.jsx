import { Link } from "react-router-dom";

function ServiceCard({ service }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4">
        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {service.category}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900">
        {service.name}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
        {service.description}
      </p>

      <Link
        to={`/services/${service.id}`}
        className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-gray-900 hover:underline"
      >
        View service
        <span aria-hidden="true" className="ml-1">
          →
        </span>
      </Link>
    </article>
  );
}

export default ServiceCard;