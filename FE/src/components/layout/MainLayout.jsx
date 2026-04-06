import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

const MainLayout = () => {
    return (
    <div className="layout">
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer />
    </div>
    )
};

export default MainLayout;