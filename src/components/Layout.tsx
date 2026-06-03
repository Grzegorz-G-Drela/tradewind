import { Outlet, NavLink } from "react-router-dom"


function Layout() {
    return (
        <div className="flex h-screen">
            <nav className="w-48">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/map'>Map</NavLink>
                <NavLink to='/trade'>Trade</NavLink>
            </nav>
            <div className="flex-1">
                <Outlet>

                </Outlet>
            </div>
        </div>
    )
}

export default Layout