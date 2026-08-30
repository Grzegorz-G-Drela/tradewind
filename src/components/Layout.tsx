import { Outlet, NavLink } from "react-router-dom";
import { Crosshair, TrendingUp } from "lucide-react";

function Layout() {
    return (
        <div className="relative h-screen">
            <nav className="bg-gray-100 gap-1 flex absolute top-4 right-4 rounded z-10">
                <NavLink to='/'
                    className={({ isActive }) =>
                        `p-2 rounded bg-gray-100 ${isActive ? 'bg-gray-200 font-medium' : 'text-gray-500'}`
                    }>
                        <Crosshair size={35} />
                </NavLink>
                <NavLink to='/trade'
                    className={({ isActive }) =>
                        `p-2 rounded bg-gray-100 ${isActive ? 'bg-gray-200 font-medium' : 'text-gray-500'}`
                    }>
                        <TrendingUp size={35} />
                </NavLink>
            </nav>
            <div className="flex-1">
                <Outlet>

                </Outlet>
            </div>
        </div>
    )
}

export default Layout;