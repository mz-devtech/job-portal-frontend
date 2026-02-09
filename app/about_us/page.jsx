import DynamicNavbar from "@/components/DynamicNavbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
    <DynamicNavbar/>
    <SecondNavbar/>
    <div className="w-full bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6 text-sm text-gray-400">
        Home / <span className="text-gray-800">About us</span>
      </div>

      {/* Top Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <p className="text-blue-600 font-medium mb-3">Who we are</p>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
            We’re highly skilled and <br /> professionals team.
          </h1>

          <p className="text-gray-500 max-w-lg leading-relaxed">
            Praesent non sem facilisis, hendrerit nisi vitae, volutpat
            quam. Aliquam metus mauris, semper eu eros vitae, blandit
            tristique metus. Vestibulum maximus nec justo sed maximus.
          </p>
        </div>

        {/* Right Stats */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-xl">
              💼
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                1,75,324
              </h3>
              <p className="text-gray-500 text-sm">Live Job</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-xl">
              🏢
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                97,354
              </h3>
              <p className="text-gray-500 text-sm">Companies</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-xl">
              👥
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                38,47,154
              </h3>
              <p className="text-gray-500 text-sm">Candidates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap justify-between items-center gap-8 opacity-60">
          <span className="text-xl font-semibold">amazon</span>
          <span className="text-xl font-semibold text-blue-600">Google</span>
          <span className="text-xl font-semibold">ENSIGMA</span>
          <span className="text-xl font-semibold">NIO</span>
          <span className="text-xl font-semibold">AIEE</span>
          <span className="text-xl font-semibold">WIDE</span>
        </div>
      </section>

      {/* Image Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl overflow-hidden">
          <Image
            src="/images/about-1.jpg"
            alt="Working man"
            width={600}
            height={450}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="rounded-xl overflow-hidden">
          <Image
            src="/images/about-2.jpg"
            alt="Remote work"
            width={600}
            height={450}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="rounded-xl overflow-hidden">
          <Image
            src="/images/about-3.jpg"
            alt="Office meeting"
            width={600}
            height={450}
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
}
