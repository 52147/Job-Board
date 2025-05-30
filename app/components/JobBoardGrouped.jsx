"use client";
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

// const jobs = [
//   {
//     title: "Data Modeller - Bangalore/Pune",
//     skills: "Data Modeller",
//     experience: "7 – 15 Years",
//     location: "BENGALURU",
//   },
//   {
//     title: "EES Validation Technician",
//     skills: "Automotive Diagnostics",
//     experience: "4 – 10 Years",
//     location: "NEW CARLISLE",
//   },
//   {
//     title: "Sr. Software Engineer",
//     skills: "MySQL",
//     experience: "4 – 15 Years",
//     location: "NOIDA",
//   },
//   {
//     title: "AWS Cloud Software Engineer-Hykd/Pune",
//     skills: "SQL,AWS,Python for Data Analysis",
//     experience: "4 – 10 Years",
//     location: "HYDERABAD",
//   },
//   {
//     title: "ssociate Team Lead",
//     skills: "SnapLogic Data Integration",
//     experience: "5 – 8 Years",
//     location: "HYDERABAD",
//   },
//   {
//     title: "Sr. Software Engineer",
//     skills: "Java 11",
//     experience: "5 – 15 Years",
//     location: "TORONTO",
//   },
//   {
//     title: "Project Manager",
//     skills: "Project Management",
//     experience: "10 – 15 Years",
//     location: "DOHA",
//   },
//   {
//     title: "Tech Specialist",
//     skills: "Java Programming",
//     experience: "3 – 15 Years",
//     location: "PUNE",
//   },
//   {
//     title: "Tech Lead",
//     skills: "Media, Telecommunications, Technology Service Mgmt",
//     experience: "5 – 15 Years",
//     location: "BENGALURU",
//   },
//   {
//     title: "Sr. Software Engineer",
//     skills: "Java Programming",
//     experience: "4 – 8 Years",
//     location: "PUNE",
//   },
//   {
//     title: "Sr. Software Engineer",
//     skills: "Java 11",
//     experience: "5 – 10 Years",
//     location: "TORONTO",
//   },
//   {
//     title: "Project Lead",
//     skills: "Teamcenter PLM",
//     experience: "15 – 25 Years",
//     location: "CINCINNATI",
//   },
// ];

const groupByLocation = (jobs) =>
  jobs.reduce((groups, job) => {
    const loc = job.location;
    groups[loc] = groups[loc] || [];
    groups[loc].push(job);
    return groups;
  }, {});

export default function JobBoardGrouped() {
    const [jobs, setJobs]     = useState([]);
    const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    skills: "",
  });

  const handleClear = () => {
    setQuery("");
    setFilters({ location: "", experience: "", skills: "" });
  };

  const handleSearch = (job) => {
    const q = query.trim().toLowerCase();
    const matchQuery = !q || job.title.toLowerCase().includes(q);
    const matchLocation =
      !filters.location || job.location === filters.location;
    const matchExperience =
      !filters.experience || job.experience === filters.experience;
    const matchSkills = !filters.skills || job.skills === filters.skills;
    return matchQuery && matchLocation && matchExperience && matchSkills;
  };

  const grouped = groupByLocation(jobs.filter(handleSearch));


  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => setJobs(data.jobs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading jobs…</p>;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Job Board</h1>

      <div className="flex flex-nowrap gap-2 mb-6 items-center">
        <div className="flex flex-col  gap-2 mb-6 sm:flex-row">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-[200px] px-8 py-2 border rounded-xl shadow-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {query && (
              <X
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                onClick={handleClear}
              />
            )}
          </div>

          <select
            value={filters.location}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-[200px] px-4 py-2 border rounded-xl shadow-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {[...new Set(jobs.map((j) => j.location))].map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            value={filters.experience}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, experience: e.target.value }))
            }
            className="w-[200px] px-4 py-2 border rounded-xl shadow-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Experience</option>
            {[...new Set(jobs.map((j) => j.experience))].map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>

          <select
            value={filters.skills}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, skills: e.target.value }))
            }
            className="w-[200px] px-4 py-2 border rounded-xl shadow-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Skills</option>
            {[...new Set(jobs.map((j) => j.skills))].map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>

          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 rounded-xl text-black hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-gray-600">No jobs found.</p>
        ) : (
          Object.entries(grouped).map(([loc, list]) => (
            <div key={loc} className="sm:mb-8 h-[300px] overflow-y-auto pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-2 border-b pb-1">
                {loc}
              </h2>
              <div className="h-[200px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
                {list.map((job, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justifyborder rounded-xl shadow-sm p-4 bg-white hover:shadow-md transition hover:scale-105"
                  >
                    <h3 className="text-lg font-semibold text-black">
                      {job.title}
                    </h3>
                    <div className="w-full flex-1 mt-2">
                      <p className="text-sm text-gray-600">
                        <strong>Skills:</strong> {job.skills}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Experience:</strong> {job.experience}
                      </p>
                    </div>
                    <a
                      href="https://talenteerusa.com/for-job-seekers/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="w-full text-center mt-2 px-3 py-1 text-sm font-medium text-white bg-[#0056a3] hover:bg-blue-700 active:scale-95 transition rounded-xl">
                        Apply/Shortlist
                      </button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
