import Welcome from "@/components/Welcome";
import Image from "next/image";

// page / component
export default function Home() {
  return (
    <main className="relative bg-black-100 flex items-center justify-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <Welcome />
    </main>
  );
}




