'use client'

export default function PopularVacancies() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-10">
          Most Popular Vacancies
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-12">

          <Vacancy
            title="Anesthesiologists"
            positions="45,904 Open Positions"
          />
          <Vacancy
            title="Surgeons"
            positions="50,364 Open Positions"
          />
          <Vacancy
            title="Obstetricians-Gynecologists"
            positions="4,339 Open Positions"
          />
          <Vacancy
            title="Orthodontists"
            positions="20,079 Open Positions"
          />

          <Vacancy
            title="Maxillofacial Surgeons"
            positions="74,875 Open Positions"
          />
          <Vacancy
            title="Software Developer"
            positions="4,359 Open Positions"
          />
          <Vacancy
            title="Psychiatrists"
            positions="18,599 Open Positions"
          />
          <Vacancy
            title="Data Scientist"
            positions="28,200 Open Positions"
            highlight
          />

          <Vacancy
            title="Financial Manager"
            positions="61,391 Open Positions"
          />
          <Vacancy
            title="Management Analysis"
            positions="93,046 Open Positions"
          />
          <Vacancy
            title="IT Manager"
            positions="50,963 Open Positions"
          />
          <Vacancy
            title="Operations Research Analysis"
            positions="16,627 Open Positions"
          />

        </div>
      </div>
    </section>
  )
}

function Vacancy({ title, positions, highlight }) {
  return (
    <div>
      <h3
        className={`text-sm font-medium ${
          highlight ? 'text-blue-600' : 'text-gray-900'
        }`}
      >
        {title}
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        {positions}
      </p>
    </div>
  )
}
