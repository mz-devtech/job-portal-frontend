import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
  <>
  <Navbar/>
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-sm font-medium text-gray-700">
            Terms & Conditions
          </h1>

          <div className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>{" "}
            / <span className="text-gray-700">Terms & Conditions</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* 01 */}
          <section id="terms" className="mb-12">
            <h2 className="text-xl font-semibold mb-4">
              01. Terms & Condition
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Praesent placerat dictum elementum. Nam pulvinar urna vel lectus
              maximus, eget faucibus turpis hendrerit. Sed accumsan nisi at
              curabitur nisi. Quisque molestie velit vitae ligula luctus
              bibendum. Duis sit amet eros mollis, viverra ipsum sed, convallis
              sapien. Donec justo erat, pulvinar vitae dui ut, finibus euismod
              enim. Donec velit tortor, mollis eu tortor euismod, gravida
              aliquam arcu.
            </p>

            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>In ac turpis mi. Donec quis semper neque.</li>
              <li>Curabitur luctus sapien augue, mattis faucibus nisl vehicula nec.</li>
              <li>Aenean vel metus leo. Vivamus nec neque a libero sodales.</li>
              <li>Vestibulum rhoncus sagittis dolor vel finibus.</li>
              <li>Integer feugiat lacus ut efficitur mattis.</li>
            </ul>
          </section>

          {/* 02 */}
          <section id="limitations" className="mb-12">
            <h2 className="text-xl font-semibold mb-4">
              02. Limitations
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              In pretium est sit amet diam feugiat eleifend. Curabitur
              consectetur fringilla metus. Morbi hendrerit facilisis tincidunt.
              Sed condimentum lacinia arcu. Ut ut lacus metus. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit.
            </p>

            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>In ac turpis mi. Donec quis semper neque.</li>
              <li>Curabitur luctus sapien augue.</li>
              <li>Mattis faucibus nisl vehicula nec.</li>
              <li>Vivamus nec neque a libero sodales.</li>
            </ul>
          </section>

          {/* 03 */}
          <section id="security" className="mb-12">
            <h2 className="text-xl font-semibold mb-4">
              03. Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              ex neque, elementum eu blandit in, ornare eu purus. Fusce eu
              rhoncus mi, quis ultrices lacus. Phasellus ut pellentesque nulla.
              Cras erat nisi, mattis et efficitur et, accumsan in lacus. Fusce
              gravida augue quis leo facilisis.
            </p>
          </section>

          {/* 04 */}
          <section id="privacy">
            <h2 className="text-xl font-semibold mb-4">
              04. Privacy Policy
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Praesent non sem facilisis, hendrerit nisl vitae, volutpat quam.
              Aliquam metus mauris, semper eu eros vitae, blandit tristique
              metus. Vestibulum maximus nec justo sed maximus.
            </p>

            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>In ac turpis mi. Donec quis semper neque.</li>
              <li>Mauris et scelerisque lorem.</li>
              <li>Aenean vel metus leo.</li>
              <li>Vestibulum rhoncus sagittis dolor vel finibus.</li>
              <li>Integer feugiat lacus ut efficitur mattis.</li>
            </ul>

            <p className="text-gray-600 mt-6 leading-relaxed">
              Fusce rutrum mauris sit amet justo rutrum ullamcorper. Aliquam
              vitae lacus urna. Nulla vitae mi vel nisl viverra ullamcorper vel
              elementum est. Mauris vitae elit nec enim tincidunt aliquet.
              Donec ultrices nulla a enim pulvinar, quis pulvinar lacus
              consectetur.
            </p>
          </section>
        </div>

        {/* Table of Contents */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 border rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              TABLE OF CONTENTS
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#terms" className="hover:text-blue-600">
                  01. Terms & Condition
                </a>
              </li>
              <li>
                <a href="#limitations" className="hover:text-blue-600">
                  02. Limitations
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-blue-600">
                  03. Security
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-blue-600">
                  04. Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
    <Footer/>
  </>
  );
}
