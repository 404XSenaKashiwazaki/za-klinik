import React, { useEffect, useReducer, useState } from 'react'
import { Link, useLocation } from "react-router-dom"
import {useFindAnimeCompleteQuery, useFindAnimeOngoingQuery} from "../features/api/apiHomeSlice"
import CardSeries from '../components/CardSeries'
import HomePaginate from '../components/HomePaginate'
import MenuSearchHome from '../components/MenuSearchHome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import BannerSlider from '../components/Banner'
import { useDispatch, useSelector } from 'react-redux'
import FooterHome from '../components/FooterHome'
import TabCategories from '../components/TabCategories'

function Home() {
    const location = useLocation()
    const { pathname } = location
    const queryParams = new URLSearchParams(location.search)
    const pages = queryParams.get('c')   
    const dispatch = useDispatch()
    const pathName = pathname.split("/")[1]
    const { search } = useSelector(state=>state.home)
    const [ perPage,setPerPage ] = useState(12)
    const [ page, setPage ] = useState(1)
    const [ search2, setSearch2 ] = useState("")
    const [ totals, setTotals ] = useState(null)
    const [ totalsPage, setTotalsPage ] = useState(null)
    const [ others,setOthers ] = useState(null)
    const [ ongoing, setOngoing ] = useState([])
    const [ complete, setComplete ] = useState([])
    const { data: dataOngoing } = useFindAnimeOngoingQuery({ search: search2,page, perPage, categories: (pages) ? pages : "" })
    
    useEffect(() => {
      // console.log(dataOngoing);
      if(dataOngoing?.response?.products) {
        const { products, totals,offset, page, totalsPage  } = dataOngoing.response
        setPage(page)
        setTotals(totals)
        setTotalsPage(totalsPage)
        setOngoing(products)
      }
    },[  dataOngoing ])

    useEffect(() => {
      setSearch2(search)
    },[ search ])

    const handleClikPaginate = ({ selected }) => {
      setPage(selected + 1)
    }

    


    return (
    <div className="">
        {/* <MenuSearchHome setSearch={setSearch} search={search} /> */}
        {/* <input onChange={(e) => setSearch(e.target.value)}  type="text" placeholder="Cari anime..." className="input w-full bg-indigo-950 text-slate-50" /> */}
        {/* card epiosode terbaru */}
        <div className="w-auto h-auto p-0 m-0   box-border md:-mt-6">
          <div className="mt-1">
            <BannerSlider />
          </div>
            <div className="flex justify-end mb-3 mt-4">
              <div>
                {/* <button className="btn btn-sm text-slate-50 font-semibold bg-indigo-900 hover:bg-indigo-800 hover:border-indigo-800">CEK ANIME ON-GOING LAINYA</button> */}
              </div>
            </div>
            <div>
              <TabCategories />
            </div>
            <div className="grid md:grid-cols-4 xl:grid-col-6 sm:grid-cols-3 grid-cols-2 gap-3 overflow-hidden">
              { ongoing.length > 0 && <CardSeries items={ongoing}/> }
            </div>
            <div className="mt-2 mb-5 flex justify-end ">
              {/* pagination  */}
              <HomePaginate
                  data={ongoing}
                  setPage={setPerPage} 
                  page={page} 
                  totalsPage={totalsPage}
                  perPage={perPage}
                  totals={totals}
                  handleClikPaginate={handleClikPaginate}
                />
              {/* pagination */}
            </div>
        </div>
    </div>
    )
}

export default Home