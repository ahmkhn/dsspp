export default function Nav(){
    return(
    <nav className="z-10 w-full border-b border-gray-600 py-4">
        <div className="flex justify-between items-center w-full px-4 sm:px-6">
          <a 
            className="z-20 inline-flex items-center justify-center text-center !bg-green-600 text-white px-4 py-2 rounded text-sm sm:text-base font-bold"
            href="/"
          >
            Homepage
          </a>
          <a 
            className="z-20 inline-flex items-center justify-center text-center !bg-green-600 text-white px-4 py-2 rounded text-sm sm:text-base font-bold"
            href="/about"
          >
            About DSSP
          </a>
        </div>
      </nav>);
}