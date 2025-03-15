import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FileText } from "lucide-react";

interface MemberCardProps {
  image: string; 
  name: string;
  expertise: string;
  linkedin?: string;
  resume?: string;
  github?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  image,
  name,
  expertise,
  linkedin,
  resume,
  github,
}) => {
  return (
    <div className="relative group w-full max-w-sm h-[420px] rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-all duration-500 hover:shadow-2xl hover:border-[#c1ff72]">
      
      {/* Background image with zoom effect */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 w-full p-6 text-white">
        <h2 className="text-2xl font-extrabold text-[#c1ff72]">{name}</h2>
        <p className="text-md text-gray-300">{expertise}</p>

        {/* Social Icons */}
        <div className="flex space-x-5 mt-4">
          {linkedin && (
            <Link href={linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={28} className="text-gray-400 hover:text-[#c1ff72] transition-colors duration-300" />
            </Link>
          )}
          {resume && (
            <Link href={resume} target="_blank" rel="noopener noreferrer">
              <FileText size={28} className="text-gray-400 hover:text-[#c1ff72] transition-colors duration-300" />
            </Link>
          )}
          {github && (
            <Link href={github} target="_blank" rel="noopener noreferrer">
              <FaGithub size={28} className="text-gray-400 hover:text-[#c1ff72] transition-colors duration-300" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
