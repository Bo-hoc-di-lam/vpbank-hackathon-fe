import { Vortex } from "../components/ui/vortex"

export default function Home() {
    return (
        <div className="w-full mx-auto rounded-md  h-full overflow-hidden">
            <Vortex
                backgroundColor="black"
                className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
            >
                <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
                    The hell is this?
                </h2>
                <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
                    This is chemical burn. It&apos;ll hurt more than you&apos;ve
                    ever been burned and you&apos;ll have a scar.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6"></div>
            </Vortex>
        </div>
    )
}
