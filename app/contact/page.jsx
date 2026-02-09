import DynamicNavbar from "@/components/DynamicNavbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";

export default function ContactPage() {
  return (
    <>
      <DynamicNavbar/>
      <SecondNavbar />
      <div className="w-full bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-400 flex justify-between">
            <span>Contact</span>
            <span>
              Home / <span className="text-gray-700">Contact</span>
            </span>
          </div>
        </div>

        {/* Top Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="text-blue-600 font-medium mb-3">Who we are</p>

            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              We care about <br /> customer services
            </h1>

            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
              Want to chat? We’d love to hear from you! Get in touch
              with our Customer Success Team to inquire about speaking
              events, advertising rates, or just say hello.
            </p>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition">
              Email Support
            </button>
          </div>

          {/* Right Form */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Get in Touch
            </h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <input
                type="text"
                placeholder="Subjects"
                className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />

              <textarea
                placeholder="Message"
                rows="4"
                className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                Send Message ✈️
              </button>
            </form>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full h-[450px]">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Chicago&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </section>
      </div>
      <Footer />

    </>
  );
}
