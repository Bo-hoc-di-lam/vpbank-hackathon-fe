import { Button } from "@/components/ui/moving-border"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { AuroraBackground } from "../components/ui/aurora-background"
export default function Home() {
    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                    <img src="/vpbank.svg" className="mb-5" />
                    Hackathon
                </div>
                <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                    Team 100 - BHDL
                </div>

                <Button
                    as={Link}
                    to="/diagram"
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                    Get Started
                </Button>
            </motion.div>
        </AuroraBackground>
    )
}
