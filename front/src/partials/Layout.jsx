import React, { useEffect, useState} from 'react'
import Sidebar from '../partials/Sidebar'
import Header from '../partials/Header'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { tokenSelector } from '../features/authSlice'
import { useFindSiteQuery } from "../features/api/apiSitesSlice"
import { setIsRestore, setSites } from '../features/siteSlice'
import ModalProfile from '../components/ModalProfile'
import { removeMessage } from '../features/authSlice'
import { Toast} from '../utils/sweetalert'
import { useAuthQuery } from '../features/api/apiAuthSlice'
import FooterHome from '../components/FooterHome'

function Layout() {
  const location = useLocation()
  const { pathname } = location
  const selector = useSelector(state=>state.auth)
  const { message } = selector
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = useSelector(tokenSelector)
  const { data:dataSite } = useFindSiteQuery()
  const [site, setSite ] = useState()
  
  useEffect(() =>{
    console.log({ message });
    
    if(message) Toast.fire({ text: message, icon: "success"})
      // dispatch(removeMessage())
  },[ message, dispatch ])
    
  useEffect(() => {
    if(dataSite?.response?.sites) {
      setSite({
        id: dataSite.response.sites.id,
        title: dataSite.response.sites.title,
        deskripsi: dataSite.response.sites.about,
        dmca: dataSite.response.sites.dmca,
        privacy_police: dataSite.response.sites.privacy_police,
        logo: dataSite.response.sites.logo,
        logo_url: dataSite.response.sites.logo_url
      }) 
    }
  },[dataSite])

  const pathName = pathname.split("/")[1]

  useEffect(() =>{
    if(site) dispatch(setSites(site))
  },[ site ])
  // if(!token) return null
    const content = (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> 
        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="px-2 sm:px-3 lg:px-4 py-8 w-full max-w-9xl mx-auto">
            {/* content */}
            { <Outlet/> }
            {/* end content */}
            </div>
            {/* { pathName == "/" || pathName == "" && <FooterHome site={site}/> } */}
          </main>
        </div>
      </div>
    )
  
  return content
    
  }

export default Layout;