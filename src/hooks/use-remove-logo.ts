import { useEffect } from "react"

const useRemoveLogo = () => {
    useEffect(() => {
        const logo: HTMLDivElement | null = document.querySelector(
            ".react-flow__panel.react-flow__attribution.bottom.right"
        )
        if (logo) {
            logo.style.display = "none"
        }
    }, [])
}

export default useRemoveLogo
