export default function Footer(){
    return(
        <footer className="w-full border-t border-gray-600 py-2 flex justify-center items-center text-center text-xs bg-black group z-10">
            <p>
                Developed by {" "}
                <a href="https://linkedin.com/in/ahmkhn"
                target="_blank"
                className="font-bold underline text-green-500"
                rel="noreferrer">
                        Ahmed Khan
                </a>
            </p>
            <p className="ml-[1.5rem]">Your feedback matters! Send us your thoughts and help us improve</p>
        </footer>
    )
}