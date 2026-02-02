import {
  Paintbrush,
  Code2,
  Megaphone,
  Video,
  Music,
  BarChart3,
  HeartPulse,
  Database,
} from "lucide-react";

const categories = [
  { title: "Graphics & Design", jobs: "357 Open position", icon: Paintbrush },
  { title: "Code & Programming", jobs: "312 Open position", icon: Code2 },
  { title: "Digital Marketing", jobs: "297 Open position", icon: Megaphone },
  { title: "Video & Animation", jobs: "247 Open position", icon: Video },
  { title: "Music & Audio", jobs: "204 Open position", icon: Music },
  { title: "Account & Finance", jobs: "187 Open position", icon: BarChart3 },
  { title: "Health & Care", jobs: "125 Open position", icon: HeartPulse },
  { title: "Data & Science", jobs: "57 Open position", icon: Database },
];

export default function PopularCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Popular category
        </h2>
        <button className="text-sm font-medium text-blue-600 hover:underline">
          View All →
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:border-blue-600"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-white/20 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>

              {/* Text */}
              <div>
                <h3 className="font-medium text-gray-900 transition group-hover:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 transition group-hover:text-blue-100">
                  {item.jobs}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
