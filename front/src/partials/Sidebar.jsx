import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import SidebarLinkGroup from './SidebarLinkGroup'
import { useDispatch, useSelector } from 'react-redux'

import { useLogoutMutation } from '../features/api/apiAuthSlice'
import { setMessage, setRemoveState, tokenSelector } from '../features/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAmbulance, faBagShopping, faCogs, faComments, faCreditCard, faFolder, faHome, faList, faMessage, faMoneyBill, faPaperPlane, faPercent, faPowerOff, faShop, faShoppingBag, faShoppingCart, faSignIn, faSignOutAlt, faSignal, faStore, faTachometerAlt, faTags, faTh, faUserCircle, faUserShield, faUsers, faUsersSlash } from '@fortawesome/free-solid-svg-icons'

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate()
  const { pathname } = location;
  const dispatch = useDispatch()
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const { site } = useSelector(state=> state.sites)
  const token = useSelector(tokenSelector)
  const { dataUser } = useSelector(state => state.auth)
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');
  const [postsMenu, setPostsMenu] = useState(localStorage.getItem("sidebar_posts") ? JSON.parse(localStorage.getItem("sidebar_posts")) : false)
  const [ logout, { data,isLoading, isSuccess, isError } ] = useLogoutMutation()
 
  const [ roles, setRoles ] = useState([])

  useEffect(() => {
    if(dataUser?.roles) setRoles(dataUser.roles.map(e=>e.name.toLowerCase()))
  },[dataUser])

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const handleClickLogout = async (e) => {
    e.preventDefault()
    try {
      await logout().unwrap()
      dispatch(setRemoveState())
      dispatch(setMessage("Anda telah logout"))
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }


  const pathName = pathname.split("/")[1]
  const posts = pathname.split("/")[3]
  const posts1 = pathname.split("/")[2]
  const posts2 = pathname.split("/")[4]

  const sidebarPosts = () => {
    setPostsMenu(false)
    localStorage.setItem("sidebar_posts",false)
  }
  
  return (!isError)  &&  (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-gradient-to-r from-blue-400 to-purple-500 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex gap-2 mb-10 pr-3 sm:px-2 items-center">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/api/dashboard" className="block">
            <div>
                <img src={site?.logo_url || "http://localhost:8000/sites/default.jpg"} className="rounded-sm" width="32" height="32" alt={site?.title} />
            </div>
          </NavLink>
          <span className="text-lg uppercase text-slate-50 font-bold">{ site?.title }</span>
        </div>

        {/* Links */}
        <div className="space-y-8">

        <div>
            <h3 className="text-xs uppercase text-slate-900 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block"> Menu</span>
            </h3>
            <ul className="mt-3 ml-1">
              {  }
              {/* Dashboard */}
              <li className={`px-3 mx-0 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('dashboard') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/dashboard"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('dashboard') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between ">
                    <div className="grow flex items-center">
                      
                      <div className="shrink-0 h-6 w-6">
                      <FontAwesomeIcon className={`fill-current ${
                            pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-500' : 'text-slate-900'
                          }`} size="1x" icon={faTachometerAlt} />
                      </div>
                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Dashboard
                      </span>
                    </div>
                    {/* Badge */}
                    {/* <div className="flex flex-shrink-0 ml-2">
                      <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-indigo-500 px-2 rounded">4</span>
                    </div> */}
                  </div>
                </NavLink>
              </li>

               {/* products */}
                <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('data-pasien') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/data-pasien"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('data-pasien') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/data-pasien' || pathname.includes('data-pasien') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faAmbulance} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Data Pasien
                    </span>
                  </div>
                </NavLink>
                </li>
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('data-obat') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/data-obat"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('data-obat') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/data-obat' || pathname.includes('data-obat') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faTags} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Data Obat
                    </span>
                  </div>
                </NavLink>
                </li>
                {/* orders */}
                <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('data-rekam-medis') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/data-rekam-medis"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('data-rekam-medis') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/data-rekam-medis' || pathname.includes('data-rekam-medis') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faFolder } />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Data Rekam Medis
                    </span>
                  </div>
                </NavLink>
                </li>
                {/* role */}
                <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('data-roles') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/data-roles"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('roles') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/data-roles' || pathname.includes('data-roles') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faUserShield} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Roles
                    </span>
                  </div>
                </NavLink>
                </li>
               {/* users */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('data-users') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/data-users"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('data-users') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/data-users' || pathname.includes('data-users') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faUsers} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Users
                    </span>
                  </div>
                </NavLink>
              </li>
                  {/* sites */}
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('data-site') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to="/data-site?p=Site Settings"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('data-site') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0 h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/data-site' || pathname.includes('data-site') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faCogs} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Sites
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
            </div>

            <div>
            <h3 className="text-xs uppercase text-slate-900 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Seettings</span>
            </h3>
            <ul className="mt-3 ml-1">
              {/* akun */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('profile') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  onClick={() =>  sidebarPosts()}
                  to={`/profile/${dataUser.username}?p=Profile Settings`}
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('users') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0  h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/profile' || pathname.includes('profile') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faUserCircle} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Profile
                    </span>
                  </div>
                </NavLink>
              </li>
              

              {/* logout */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('logout') && 'bg-slate-900'} cursor-pointer`}>
                <div
                  onClick={(e) => handleClickLogout(e)}
                  className={`block text-slate-200 truncate transition duration-150 ${
                    pathname.includes('logout') ? 'hover:text-slate-200' : 'hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                  <div className="shrink-0  h-6 w-6 ">
                    <FontAwesomeIcon className={`fill-current ${
                          pathname === '/logout' || pathname.includes('logout') ? 'text-indigo-500' : 'text-slate-900'
                        }`} size="1x" icon={faPowerOff} />
                    </div>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Logout
                    </span>
                  </div>
                </div>
              </li>
            </ul>
            </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-900" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-900" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Sidebar;
