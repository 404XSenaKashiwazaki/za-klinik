import { faAmbulance, faArrowRight, faComments, faDollar, faFolder, faMessage, faMoneyBill, faMoneyBillTransfer, faMoneyBillTrendUp, faMoneyBills, faPaperPlane, faSignal5, faStore, faStoreAlt, faTachometerAlt, faTags, faUser, faUserGroup, faUserShield, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useCountAllInfoQuery } from "../features/api/apiDashboardSlice"
import { Link } from "react-router-dom"
import UserChart from '../components/UserChart'
import { formatRp } from "../utils/FormatRp"
import DashboardCard from '../components/DashboardCard'
import TimeAgo from '../components/TimeAgo';
import { formatDateTime } from '../utils/Utils';
import { Helmet } from 'react-helmet'

function Dashboard() {
  const [ users, setUsers ] = useState(0)
  const [ time, setTime ] = useState(0)
  const [ topSelling, setSelling ] = useState(0)
  const [ medicalRecords, setMedicalRecords ] = useState(0)
  const [ drugs, setDrugs ] = useState(0)
  const [ patients, setPatients ] = useState(0)
  const [ username, setUsername ] = useState(null)
  const { dataUser } = useSelector(state=> state.auth)
  const { data } = useCountAllInfoQuery()
  
  // useEffect(() => {
  //   setTimeout(() => {
  //     setTime(new Date())
  //   },1000)
  // },[ time ])

  useEffect(() => {
    if(data) {
      setUsers(data.response.usersCount)
      setMedicalRecords(data.response.medicalRecordsCount)
      setDrugs(data.response.drugsCount)
      setPatients(data.response.patientsCount)
    }
  },[ data ])

  useEffect(() => {
    if(dataUser?.username) setUsername(dataUser.username)
  },[ dataUser ])

  return (
    <div className="w-full">
      <Helmet >
        <title>
            Dashboard
        </title>
      </Helmet>
      <div className="flex gap-2 justify-between">
        <h1 className="mb-5 font-bold">Dashboard </h1>
        {/* <p className="font-medium">{ formatDateTime(time) }</p> */}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3">
        <Link to={`/data-pasien`}>
          <DashboardCard  
              title="Data Pasien"
              value={ patients }
              description=""
              color="bg-green-700"
              textColor="text-slate-100"
              icon={<FontAwesomeIcon icon={faAmbulance}/>}
          />
        </Link>
        <Link to={`/data-users`} >
          <DashboardCard  
              title="Total User"
              value={ users }
              description=""
              color="bg-blue-500"
              textColor="text-slate-100"
              icon={<FontAwesomeIcon icon={faUsers}/>}
          />
        </Link>
        <Link to={`/data-obat`} >
          <DashboardCard  
              title="Data Obat"
              value={ drugs }
              description=""
              color="bg-cyan-500"
              textColor="text-slate-100"
              icon={<FontAwesomeIcon icon={faTags}/>}
          />
        </Link>
        <Link to={`/data-rekam-medis`} >
          <DashboardCard  
              title="Data Rekam Medis"
              value={ medicalRecords }
              description=""
              color="bg-green-500"
              textColor="text-slate-100"
              icon={<FontAwesomeIcon icon={faFolder}/>}
          />
        </Link>
      </div>
      <div className="mt-10">
          <UserChart />
      </div>
    </div>
  );
}

export default Dashboard;