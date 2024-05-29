import { DiagramLayout as Layout } from "@/components/layouts"
import { Outlet } from "react-router-dom"

const DiagramLayout = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}

export default DiagramLayout
