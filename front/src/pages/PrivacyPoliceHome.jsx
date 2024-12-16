import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faEnvelope, faKey, faPlayCircle, faPowerOff, faSave, faSpinner, faTags, faTriangleExclamation, faUser, faUserShield, faVideo } from "@fortawesome/free-solid-svg-icons"
import { useSelector } from "react-redux"


const PrivacyPolice = () => {
    const { site } = useSelector(state=> state.sites)
    return(
        <div className="mx-1 h-auto md:mx-auto md:w-fit box-border mt-10 mb-24">
        {/* card epiosode terbaru */}
        <div className="md:w-[850px] mx-5 shadow-2xl">
            <div className="flex justify-between mb-3">
               <div>
                    <h1 className="text-sm md:font-semibold text-slate-50"><FontAwesomeIcon icon={faTriangleExclamation} /> Privacy Police</h1>
               </div>
               <div>
                {/* <button className="btn btn-sm text-slate-50 font-semibold bg-indigo-900 hover:bg-indigo-800 hover:border-indigo-800">CEK ANIME ON-GOING LAINYA</button> */}
               </div>
            </div>
            <div className="text-slate-50">
                <div className="mb-4 mx-2">
                    <span>{site?.title || ""} </span>
                </div>
                <div className="mx-2 mb-4 pb-5">
                    <p>{ site?.privacy_police || ""}</p>
                </div>
            </div>
        </div>

    </div>
    )
}

export default PrivacyPolice