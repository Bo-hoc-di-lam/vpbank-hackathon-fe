import { useHotkeys } from "@mantine/hooks"

export const useWtf = () => {
    useHotkeys([
        [
            "A+A",
            () =>
                (window.location.href =
                    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
        ],
    ])
}
