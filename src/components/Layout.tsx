import { Outlet, NavLink } from "react-router-dom"


function Layout() {
    return (
        <div className="flex h-screen">
            <nav className="w-48 border-r border-gray-300 p-4 flex flex-col gap-2">
                <NavLink
                to='/'
                className={({ isActive }) =>
                `p-2 rounded ${isActive ? 'bg-gray-200 font-medium' : 'text-gray-600'}`
                }
                >
                    Home
                </NavLink>
                <NavLink
                to='/trade'
                className={({ isActive }) =>
                `p-2 rounded ${isActive ? 'bg-gray-200 font-medium' : 'text-gray-600'}`
                }
                >
                    Trade
                </NavLink>
            </nav>
            <div className="flex-1">
                <Outlet>

                </Outlet>
            </div>
        </div>
    )
}

export default Layout