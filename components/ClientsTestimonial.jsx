"use client";

const testimonials = [
  {
    name: "Robert Fox",
    role: "UI/UX Designer",
    image: "https://i.pravatar.cc/40?img=1",
    text:
      "Ul ullamcorper hendrerit tempor. Aliquam in rutrum dui. Maecenas ac placerat metus, in faucibus est.",
  },
  {
    name: "Bessie Cooper",
    role: "Creative Director",
    image: "https://i.pravatar.cc/40?img=2",
    text:
      "Mauris eget lorem odio. Mauris convallis justo molestie metus aliquam lacinia. Suspendisse ut dui vulputate augue condimentum ornare.",
  },
  {
    name: "Jane Cooper",
    role: "Photographer",
    image: "https://i.pravatar.cc/40?img=3",
    text:
      "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  },
];

export default function ClientsTestimonial() {
  return (
    <section className="relative bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Title */}
        <h2 className="mb-12 text-center text-2xl font-semibold text-gray-900">
          Clients Testimonial
        </h2>

        {/* Arrows */}
        <button className="absolute left-6 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow md:block">
          ←
        </button>
        <button className="absolute right-6 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow md:block">
          →
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="relative rounded-xl bg-white p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              {/* Text */}
              <p className="mb-6 text-sm text-gray-600">
                “{item.text}”
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>

              {/* Quote Icon */}
              <div className="absolute bottom-6 right-6 text-4xl text-gray-200">
                “
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-10 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-400"></span>
          <span className="h-2 w-2 rounded-full bg-blue-200"></span>
          <span className="h-2 w-2 rounded-full bg-blue-200"></span>
        </div>
      </div>
    </section>
  );
}
