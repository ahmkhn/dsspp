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
      <nav className="z-10 mb-10 w-full border-b border-gray-600 py-4 flex flex-col sm:flex-row items-center">
        <div className="flex flex-col sm:flex-row justify-center items-center w-full px-4 sm:px-6 space-y-4 sm:space-y-0">
          <a 
            className="inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
            href="/"
          >
            Homepage
          </a>
        </div>
  </nav>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 text-center">
          The Decolonization of Social Sciences in Pakistan
        </h1>
      </div>
      
      <div className="flex flex-col text-justify">
        <div className="flex flex-col gap-4 max-w-6xl mx-auto">
          <div className="flex-1 border border-gray-600 p-4 md:p-6 lg:p-8 rounded-lg bg-gray-800 bg-opacity-75">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
            Are you someone interested in challenging colonial legacies within social sciences? Are you interested in decolonizing bureaucratic thought to pave the way to modern governance in Pakistan? Is your research focused on the intersection of governance and decolonization? Do you believe in the power of indigenous knowledge and perspectives? Are you passionate about reshaping social sciences to better reflect local contexts and realities? Do you want to contribute to a broader understanding of decolonization beyond traditional academic boundaries? Are you eager to collaborate on projects that seek to dismantle power imbalances in academia? Are you looking for opportunities to engage in interdisciplinary research that addresses pressing social issues? Do you see yourself as part of a global conversation on decolonizing social sciences? If yes, let's get started by plotting your info on the map!
            </p>
          </div>
        </div>
        <div className="mt-8 flex-1 border border-gray-600 p-4 md:p-6 lg:p-8 rounded-lg bg-gray-800 bg-opacity-75">
            <h1 className="mt-4 font-extrabold  text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed text-center">
            Rabia Akhtar, Academic Entrepreneur, DSSP Lead
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
              Rabia Akhtar is the Dean of the Faculty of Social Sciences at the University of Lahore, where she has established herself as a visionary leader and academic entrepreneur. A Professor of International Relations, she is the driving force behind the Centre for Security, Strategy, and Policy Research (CSSPR) and the School of Integrated Social Sciences (SISS), both of which are her innovative projects aimed at reshaping academic discourse and policy research in Pakistan.
            </p>
            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
            Dr. Akhtar holds a PhD in Security Studies from Kansas State University and Master's degrees in International Relations from Quaid-i-Azam University, Islamabad, and in Political Science from Eastern Illinois University, USA. Her research has spanned critical areas such as South Asian nuclear security, deterrence dynamics, emerging technologies, media disinformation, and Pakistan’s foreign policy.
            </p>

            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
            She is the editor of <a target="_blank" className="italic text-blue-500 underline" href="https://pakistan.fes.de/e/china-pakistan-economic-corridor-beyond-2030-a-green-alliance-for-sustainable-development.html"> CPEC Beyond 2030: A Green Alliance for Sustainable Development</a>, published by FES Pakistan in August 2024, underscoring her commitment to fostering regional cooperation and sustainable development. In 2018, Dr. Akhtar authored <a target="_blank" className="italic text-blue-500 underline" href="https://csspr.uol.edu.pk/f2c/">The Blind Eye: U.S. Non-proliferation Policy Towards Pakistan from Ford to Clinton </a>, showcasing her expertise as a nuclear historian.
            </p>

            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
            As the Editor of <a target="_blank" className="italic text-blue-500 underline" href="https://pakistanpolitico.com/">Pakistan Politico,</a>, Pakistan's pioneering strategic and foreign affairs magazine, another one of her projects, Dr. Akhtar continues to influence public discourse. Her policy experience includes serving as a member of Prime Minister Imran Khan's Advisory Council on Foreign Affairs from 2018 to 2022. She is a Nonresident Senior Fellow at the South Asia Center, Atlantic Council, Washington DC, and a Nonresident Fellow at BASIC, UK. She is currently a Visiting Fellow at the Project for Managing The Atom at the Belfer Center, Harvard Kennedy School for 2024-2025.
            </p>

            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
            Her global reach extends to teaching roles at the NATO Defence College, the NPIHP Nuclear Bootcamp in Rome, and ISODARCO in Andalo, Italy. Through her role as an academic entrepreneur, Dr. Akhtar continues to push the boundaries of knowledge and policy innovation in Pakistan and beyond.
            </p>

            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl"> Contact: <a target="_blank" className="text-blue-500 underline" href="mailto:rabia.akhtar@csspr.uol.edu.pk">rabia.akhtar@csspr.uol.edu.pk</a></p>
            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl"> LinkedIn: <a target="_blank" className="text-blue-500 underline" href="https://www.linkedin.com/in/dr-rabia-akhtar-4a702b49/">Rabia Akhtar</a></p>

          </div>

          <div className="mt-8 flex-1 border border-gray-600 p-4 md:p-6 lg:p-8 rounded-lg bg-gray-800 bg-opacity-75">
            <h1 className="mt-4 font-extrabold  text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed text-center">
            Ahmed Khan, CS @ UMass, Developer of DSSP
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
              Hi! I'm Ahmed, a junior at the University of Massachusetts, Amherst studying Computer Science.
            </p>

            <h1 className="mt-4 font-extrabold  text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed text-center">
            Origin of DSSP
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
            The idea was initiated by Dr. Rabia Akhtar, who reached out with a vision to create a platform that could bring together minds from around the world. Through brainstorming and collaboration, this concept evolved into the application you see today.
            </p>
            <h1 className="mt-4 font-extrabold  text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed text-center">
            Development Process
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
            The journey from idea to reality involved several key processes. Initially, we focused on actualizing the concept by determining how to implement functionality that connects users. This included gathering input and conducting tests with a diverse group of individuals, followed by continuous refinement based on their feedback and experiences.
            </p>
            <h1 className="mt-4 font-extrabold  text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed text-center">
            Our Achievement
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl">
            We're proud to present an application that we believe truly embodies our initial vision. It represents not just technological innovation, but a step towards creating a more inclusive and diverse approach to social sciences.
            We invite you to explore, engage, and contribute to this growing global community!
            </p>

            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl"> Contact: <a target="_blank" className="text-blue-500 underline" href="mailto:ahmkhnwork@gmail.com">ahmkhnwork@gmail.com</a></p>
            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl"> LinkedIn: <a target="_blank" className="text-blue-500 underline" href="https://www.linkedin.com/in/ahmkhn">Ahmed Khan</a></p>
          </div>
      </div>
    </div>
  );
}
