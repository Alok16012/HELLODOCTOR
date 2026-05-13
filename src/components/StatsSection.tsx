import { stats } from "@/data/colleges";

export default function StatsSection() {
  return (
    <section className="py-14 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Trusted by Thousands of Students</h2>
          <p className="text-blue-200">Our platform helps students make the best decisions for their future</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-blue-200 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
