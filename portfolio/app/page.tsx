import Welcome from "@/components/Welcome";
import Image from "next/image";

// page / component
export default function Home() {
  return (
    <main className="relative bg-black-100 flex items-center justify-center flex-col overflow-hidden w-full mx-auto px-0 sm:px-10">
      <Welcome />
    </main>
  );
}




