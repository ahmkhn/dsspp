import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <p className="!leading-tight text-center text-balance font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        Decolonizing <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500">Social Sciences</span> in Pakistan
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4" />
      <p className="text-center !leading-tight text-balance font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        An application that fosters a global community where users can <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500">share their research and collaborate</span> promoting a sense of unity and mutual support
      </p>
    </div>
  );
}