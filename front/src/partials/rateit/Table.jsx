import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel,faMessage, faSearch, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from "react-redux"
import { mySwal } from '../../utils/sweetalert'
import { formatRp } from '../../utils/FormatRp'
import TimeAgo from '../../components/TimeAgo'
import { typeStatusPayments } from "../../utils/Type"

function Table({ 
  data,
  setItemContact,
  setShowModalDetail,
  setId,
  setShowContact,
  setShowRating,
  }) {


  const handleClickDetail = (e,slug) => {
    e.preventDefault()
    setId(slug)
    setShowModalDetail(true)
  }

  return (
    <>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs  font-semibold uppercase text-slate-400 bg-slate-50">
                <tr>
                <th className="p-2 whitespace-nowrap ">
                    <div className="font-semibold text-left">
                      <div className="w-full h-full shrink-0">
                      </div>
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Produk</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Status</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Qty</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Tanggal</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Total Bayar</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-center">Actions</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100">
                {
                data.length > 0 && data.map((d,index) => {
                  return (
                    <tr key={d.id}>
                      <td className="p-2 whitespace-nowrap max-w-[30px] overflow-hidden">
                        <div className="flex items-center">
                          <div className="w-full h-full shrink-0">
          
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> { (d.Products && d.Products.length > 0) && d.Products.map(e2=> <p key={e2.id} className="font-medium">{ e2.nama_produk.slice(0,10) }...</p>) }</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> <span className={`w-full px-4 ${ typeStatusPayments(d.status) } text-white py-1 rounded-none font-bold text-sm  transition uppercase `}>{ (d.status == "settlement") ? "paid": d.status }</span></div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> { (d.Products && d.Products.length > 0) && <p>{ d.Products.length }</p> }</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium flex flex-col gap-1"> <span>{  new Date(d.createdAt).toString().slice(3,25) }</span> <TimeAgo date={d.createdAt} /> </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                          <div className="text-start font-medium"> { formatRp(d.total_price) }</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-lg text-center p-1">
                            <button 
                              onClick={(e) => handleClickDetail(e,d.id)}
                              className='
                              bg-cyan-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300 
                              h-auto text-sm w-auto
                              font-medium text-center hover:bg-cyan-900
                              hover:text-slate-200 mr-1'
                              ><FontAwesomeIcon  icon={faSearch} /></button>
                              <button 
                              onClick={(e) => {
                                const products = d.Products.map(p=>({ 
                                  produk: p.nama_produk,
                                  harga: p.harga_produk,
                                  slug: p.slug,
                                  desk: p.desk_produk
                                }))
                                setItemContact({
                                  username: d.User.username,
                                  email: d.User.email,
                                  transactionId: d.transactionId,
                                  profileUrl: d.User.UsersDetail.profileUrl,
                                  content: "",
                                  products
                                })
                                setId(d.transactionId)
                                setShowContact(true)
                              }}
                              className='
                              bg-blue-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300 
                              h-auto text-sm w-auto
                              font-medium text-center hover:bg-blue-900
                              hover:text-slate-200 mr-1'
                              ><FontAwesomeIcon  icon={faMessage} /></button>
                              <button 
                              onClick={(e) => {
                                const products = d.Products.map(p=>({ 
                                  produk: p.nama_produk,
                                  harga: p.harga_produk,
                                  slug: p.slug,
                                  desk: p.desk_produk,
                                  id: p.id,
                                  qty: p.OrdersItems.quantity,
                                  OrderItemId: p.OrdersItems.id,
                                  total: d.total_price,
                                  imageProducts: p.ImageProducts[0].url_image,
                                  UserId: d.User.id,
                                  ProductId: p.id,
                                  username: d.User.username,
                                  fullname: d.User.namaDepan+" "+ d.User.namaBelakang,
                                  image: d.User.UsersDetail.profileUrl
                                }))
                                setItemContact({
                                  username: d.User.username,
                                  UserId: d.User.id,
                                  OrderId: d.id,
                                  products
                                })
                                setId(d.transactionId)
                                setShowRating(true)
                              }}
                              className='
                              bg-green-600 px-4 py-1 rounded-sm 
                              border-0 text-slate-300 
                              h-auto text-sm w-auto
                              font-medium text-center hover:bg-green-900
                              hover:text-slate-200 mr-1'
                              ><FontAwesomeIcon  icon={faStar} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                }) 
                }
              </tbody>
            </table>
          </div>
        </div>
    </>
  )
}

export default Table