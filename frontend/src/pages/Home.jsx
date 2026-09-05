import Navbar from "../components/layout/Navbar";
import SearchBar from "../components/common/SearchBar";
import ServiceCard from "../components/common/ServiceCard";
import services from "../data/services";

function Home() {
  function handleSearch(query) {
    console.log("Searching for:", query);
  }

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Government services, simplified
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Find the government service you need.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Discover eligibility, required documents, responsible offices,
              and the steps you need to follow.
            </p>

            <div className="mt-8">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* Popular Services */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Popular services
              </h2>

              <p className="mt-2 text-gray-600">
                Start with a service you already know you need.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;

