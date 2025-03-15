import React from "react";
import MemberCard from "./MemberCard";

const teamMembers = [
  {
    image: "/images/team/jensen.webp",
    name: "Anton Njavro",
    expertise: "Hardware Engineer",
    linkedin: "https://www.linkedin.com/in/anton-njavro",
    github: "https://github.com/anton-njavro",
    resume: "/resumes/anton.pdf",
  },
  {
    image: "/images/team/jobs.webp",
    name: "Ryan Nguyen",
    expertise: "AI Engineer",
    linkedin: "https://www.linkedin.com/in/ryan-nguyen",
    github: "https://github.com/ryan-nguyen",
    resume: "/resumes/ryan.pdf",
  },
  {
    image: "/images/team/musk.webp",
    name: "David Neary",
    expertise: "Product Manager",
    linkedin: "https://www.linkedin.com/in/david-neary",
    github: "https://github.com/david-neary",
    resume: "/resumes/david.pdf",
  },
  {
    image: "/images/team/ive.webp",
    name: "Djordje Ivanovic",
    expertise: "Frontend Developer",
    linkedin: "https://www.linkedin.com/in/djordje-ivanovic",
    github: "https://github.com/djordje-ivanovic",
    resume: "/resumes/djordje.pdf",
  },
];

const TeamGrid: React.FC = () => {
  return (
    <section
      className="py-20 px-6 text-center relative overflow-hidden"
    >

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-[#c1ff72] mb-12 uppercase tracking-wide">
          Meet the Team
        </h2>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="transform transition duration-300 hover:scale-105">
              <MemberCard {...member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;
