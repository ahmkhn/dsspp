export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <h1 className="!leading-tight text-center text-balance font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
        Decolonizing <span className="block text-transparent bg-clip-text">Social Sciences</span> in Pakistan
      </h1>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4" />
      <p className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
        A platform for a global community to share <span className="from-blue-500 via-pink-500 to-blue-500 bg-gradient-to-r block text-transparent bg-clip-text">research</span> and <span className="block text-transparent bg-clip-text">collaborate</span>, fostering <span className="block text-transparent bg-clip-text">unity</span> and <span className="block text-transparent bg-clip-text">mutual support</span>
      </p>
    </div>
  );
}