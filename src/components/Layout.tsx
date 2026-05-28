import { Outlet } from "react-router-dom"


function Layout() {
    return (
        <div>
            <nav>Navbar</nav>
            <Outlet>

            </Outlet>
        </div>
    )
}

export default Layout