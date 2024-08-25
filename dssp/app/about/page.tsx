import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

export default async function About() {
  return (
    <div className="flex w-full flex-col items-center min-h-screen bg-black bg-dot-thick-neutral-800 group justify-center">
      <StarsBackground className="important" starDensity={0.0001} />
      <ShootingStars
        starColor="green-200"
        trailColor="white"
        minDelay={800}
        maxDelay={1200}
        starHeight={6}
        starWidth={40}
      />
      <div className="flex flex-col items-center">
        <a className="w-[6rem] z-50 mb-20 bg-white text-black p-2 rounded-2xl" href="/">Homepage</a>
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          About The Decolonization of Social Sciences in Pakistan
        </h1>
      </div>
      <div className="flex flex-col gap-4 text-center border border-gray-600 p-8 rounded-lg bg-gray-800 bg-opacity-75 max-w-3xl mx-auto">
        <p className="text-2xl text-gray-200 leading-relaxed">
          Are you someone interested in challenging colonial legacies within social sciences? Are you interested in decolonizing bureaucratic thought to pave the way to modern governance in Pakistan? Is your research focused on the intersection of governance and decolonization? Do you believe in the power of indigenous knowledge and perspectives? Are you passionate about reshaping social sciences to better reflect local contexts and realities? Do you want to contribute to a broader understanding of decolonization beyond traditional academic boundaries? Are you eager to collaborate on projects that seek to dismantle power imbalances in academia? Are you looking for opportunities to engage in interdisciplinary research that addresses pressing social issues? Do you see yourself as part of a global conversation on decolonizing social sciences? If yes, let's get started by plotting your info on the map!
        </p>
      </div>
    </div>
  );
}
