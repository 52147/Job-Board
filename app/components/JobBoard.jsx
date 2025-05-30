export default function JobBoard() {
    const jobs = [
      {
        title: 'Sr. Software Engineer',
        location: 'Toronto',
        skills: 'Java 11',
        experience: '5 – 10 Years',
      },
      {
        title: 'AWS Cloud Engineer',
        location: 'Hyderabad',
        skills: 'SQL, AWS, Python',
        experience: '4 – 10 Years',
      },
      // 加更多 job...
    ]
  
    return (
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
            <p className="text-gray-600 mt-1">
              📍 {job.location} | 🛠 {job.skills} | 🧭 {job.experience}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Apply
            </button>
          </div>
        ))}
      </div>
    )
  }