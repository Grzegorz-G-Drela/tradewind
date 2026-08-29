import { Outlet, NavLink } from "react-router-dom";
import { Crosshair, TrendingUp } from "lucide-react";

function Layout() {
    return (
        <div>
            <nav className="w-48  flex">
                <NavLink to='/'
                    className={({ isActive }) =>
                        `p-2 rounded ${isActive ? 'bg-gray-200 font-medium' : 'text-gray-600'}`
                    }>
                    <button>
                        <Crosshair size={35} />
                    </button>
                </NavLink>
                <NavLink to='/trade'
                    className={({ isActive }) =>
                        `p-2 rounded ${isActive ? 'bg-gray-200 font-medium' : 'text-gray-600'}`
                    }>
                    <button>
                        <TrendingUp size={35} />
                    </button>
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