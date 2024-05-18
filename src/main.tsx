import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import "./styles/global.css"
import "reactflow/dist/style.css"
import Home from "./pages"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import DiagramPage from "./pages/diagram"

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/diagram",
        element: <DiagramPage />,
    },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
)
