import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{
        background: "radial-gradient(circle, rgba(193,255,114,0.2) 10%, rgba(24,24,24,1) 90%)",
        color: "#f7f7f7",
      }}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-[800px] h-[800px] bg-[#c1ff72] rounded-full blur-[150px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <h1
          className="text-6xl md:text-7xl font-extrabold tracking-tight uppercase mb-6"
          style={{ color: "#c1ff72" }}
        >
          Lantern
        </h1>
        <p className="text-xl md:text-2xl leading-snug text-gray-300 mb-4">
          A Resilient, Software-Defined LoRa Mesh Network
          <br />for Tactical, Decentralized Communication.
        </p>

        {/* Call to Action */}
        <Link
          href="/contact"
          className="inline-block px-10 py-4 text-lg font-semibold rounded-full border border-primary bg-transparent text-primary transition-all hover:bg-primary hover:text-dark shadow-md"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}
