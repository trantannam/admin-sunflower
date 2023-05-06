import axios from "axios";
import InputField from "components/custom-field/InputField";
import Modal from "components/Modal";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { VscTriangleRight } from "react-icons/vsc";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import numberWithCommas from "utils/numberWithCommas";
import SelectedStatus from "./components/SelectedStatus";

export default function OrderDetail (props) {
  const { id } = useParams();
  const [order, setOrder] = useState()
  const [modalConfirm, setModalConfirm] = useState(false)
  const [promotion, setPromotion] = useState(false)
  const [modalPromotion, setModalPromotion] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    errorFrameNumber: '',
    errorEngineNumber: '',
    timeReceived: '',
  })
  function fetchDetailOrder (id) {
    axios.get(`/orders/${id}`).then(res => {
      if (res.data.success) {
        const orderDetail = res.data.data || [];
        setFormData((prev) => ({
          ...prev,
          orderId: id,
          orderMoTo: orderDetail.orderMoTo._id
        }))
        setOrder(orderDetail)
        setLoading(false)
      } else {
        toast.error('Không thể kết nối máy chủ')
      }
    }).catch((e) => console.error)
  
  }
  useEffect(() => {
    setLoading(true)
    fetchDetailOrder(id)
  }, [id]);

  const [formData, setFormData] = useState({
    orderId: id || '',
    orderMoTo: '',
    frameNumber: "",
    engineNumber: "",
    timeReceived: ""
  })

  const checkFrameNumber = (value) => {
    const frameNumber = new RegExp(/^[A-Z0-9@#$&]{17}$/)
    setFormData({ ...formData, frameNumber: value })
    if (frameNumber.test(value)) {
      setErrorMessage({ ...errorMessage, errorFrameNumber: 1 })
    } else {
        setErrorMessage({ ...errorMessage, errorFrameNumber: "Số khung không hợp lệ." })
    }
  }
  const checkEngineNumber = (value) => {
    const engineNumber = new RegExp(/^[A-Z0-9@#$&]{10,17}$/)
    setFormData({ ...formData, engineNumber: value })
    if (engineNumber.test(value)) {
      setErrorMessage({ ...errorMessage, errorEngineNumber: 1 })
    } else {
        setErrorMessage({ ...errorMessage, errorEngineNumber: "Số máy không hợp lệ." })
    }
  }
  const checkNull = (id, value) => {
    if(!value) setErrorMessage({ ...errorMessage, [id]: "Không được để trống." })
    else {
      setErrorMessage({ ...errorMessage, [id]: 1 })
      setFormData({ ...formData, [id]: value })
    }
  }
  function FormError(props) {
      if (props.isHidden) return (<div></div>)
      else return (<div className="form-error">{props.errorMessage}</div>)
  }

  const showModalConfirmVehicle = (idOrderMoTo) => {
    setFormData(prev => ({
      ...prev,
      orderMoTo: idOrderMoTo
    }))
    setModalConfirm(true);
  }

  const showModalPromotion = (promotion) => {
    setPromotion(promotion)
    setModalPromotion(true);
  }

  const handleReceivedVehicle = (e) => {
    e.preventDefault();
    let count=0
    Object.entries(errorMessage).map(([key, val]) => {
      if(val === 1){
        return count++;
      }
      return count;
    })
    if(count === 3) {
      axios.post('/orders/mo-to/received', formData)
      .then(res=> {
        if(res.data.success){
          toast.success('Tạo thành công')
          fetchDetailOrder(id)
          setModalConfirm(false)
        } else {
          toast.error(res.data.message)
        }
      }).catch((e)=>{
        console.log(e.message)
      })
    } else {
      console.log('')
    }
  }

  return (
    <>
      <Modal show={modalConfirm} setShow={setModalConfirm} title="Cập nhật thông tin xe">
        <form className="form" onSubmit={handleReceivedVehicle}>
          <div className="form__item">
              <label htmlFor="FrameNumber" className="form__item__label">Số khung xe: </label>
              <input
                  className="form__item__input"
                  type="FrameNumber"
                  id="FrameNumber"
                  placeholder="FrameNumber"
                  defaultValue={formData?.frameNumber}
                  required
                  onChange={(e) => checkFrameNumber(e.target.value)} />
              <FormError isHidden={errorMessage.errorFrameNumber === 1} errorMessage={errorMessage.errorFrameNumber} />
          </div>
          <div className="form__item">
              <label htmlFor="EngineNumber" className="form__item__label">Số máy xe: </label>
              <input
                  className="form__item__input"
                  type="EngineNumber"
                  id="EngineNumber"
                  placeholder="EngineNumber"
                  defaultValue={formData?.engineNumber}
                  required
                  onChange={(e) => checkEngineNumber(e.target.value)} />
              <FormError isHidden={errorMessage.errorEngineNumber === 1} errorMessage={errorMessage.errorEngineNumber} />
          </div>
          <div className="form__item">
              <label htmlFor="time" className="form__item__label">Thời gian nhận xe</label>
              <input
                  className="form__item__input"
                  type="datetime-local"
                  id="time"
                  defaultValue={formData?.timeReceived}
                  required
                  onChange={(e) => checkNull('timeReceived', e.target.value)} />
              <FormError isHidden={errorMessage.timeReceived === 1} errorMessage={errorMessage.timeReceived} />
          </div>
          <div className="w-full text-right">
            <button className="btn btn-received" type="submit">Xác nhận</button>
          </div>
        </form>
      </Modal>
      <Modal show={modalPromotion} setShow={setModalPromotion} title="Thông tin khuyến mãi">
      <div className="col-span-6 sm:col-span-4 mr-4">
            <div className="grid grid-cols-6">
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  label="Tiêu đề"
                  type="text"
                  name="content"
                  disabled={true}
                  defaultValue={promotion.content}
                  onChange={(e) => checkNull('content', e.target.value)}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  label="Phần trăm (%) hoặc số tiền muốn giảm"
                  name="rate"
                  type="number"
                  disabled={true}
                  defaultValue={promotion.rate}
                  onChange={(e) => checkNull('rate', e.target.value)}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  label="Ngày bắt đầu"
                  name="date_start"
                  min={moment().format('YYYY-MM-DD')}
                  type="date"                    
                  disabled={true}de
                  defaultValue={moment(promotion.dateStart).format('YYYY-MM-DD')}
                  onChange={(e) => checkNull('dateStart', e.target.value)}
                  />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  label="Ngày kết thúc"
                  name="date_end"
                  min={moment().format('YYYY-MM-DD')}
                  type="date"
                  disabled={true}de
                  defaultValue={moment(promotion.dateEnd).format('YYYY-MM-DD')}
                  onChange={(e) => checkNull('dateEnd', e.target.value)}
                  />
              </div>
              <div className="col-span-6 sm:col-span-6">
                <div className="p-2 border border-sky-400 min-h-[50px] max-h-40 overflow-auto rounded-lg mb-2">
                {
                  promotion?.items?.length ? promotion.items.map((item, index) => (
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2" key={index}>
                      <p><VscTriangleRight /> {item}</p>
                    </div>
                  )) : ""
                }
                </div>
              </div>
            </div>
          </div>
      </Modal>
      <Link to="/orders" className="btn btn-info">Quay lại</Link>
      <div className="my-order-list-item">
        {
          loading ?
            <div className="border border-blue-300 shadow rounded-md p-4 w-full">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
        :
          order && <div>
            {
              (order.status === 1 || order.status === -1) ? '' : 
              <div className="flex items-center border-b mb-2">
                <span>Thay đổi trạng thái đơn hàng: </span>
                <span className="w-64 mx-4">
                  <SelectedStatus id={id} order={order} loading={setLoading} refreshData={()=>fetchDetailOrder(id)}/>
                </span>
              </div>
            }
          <div className="item-tag"
              style={{
                  color:
                      order?.status === 1 ? "green" :
                          order?.status === 3 ? "#d40a25" :
                              "#ffc318"
              }}
          >
              <i className="fas fa-tag"></i>
          </div>
          <div className="item-top">
              <div className="item-top-left">
                  <h2 className="text-lg"><b>Mã đơn hàng: </b> <i>{order._id}</i></h2>
                  <p className="flex items-center">
                      <AiOutlineClockCircle className="mr-2"/>
                      <i> Ngày đặt hàng: {moment(order.createdAt).format("DD/MM/YYYY hh:mm")}</i>
                  </p>
              </div>
                <div className="item-top-status_right">
                  <div className={`btn btn-${
                      order.status === 0 ? 'pending' :
                      order.status === 3 ? 'transport' :
                      order.status === 2 ? 'transport' :
                      order.status === 1 ? 'received' : 'cancel'
                  }`}>{
                      order.status === 0 ? 'Đang xử lý' :
                      order.status === 2 ? 'Đã tiếp nhận' :
                      order.status === 3 ? 'Đang vận chuyển' :
                      order.status === 4 ? 'Chờ nhận' :
                      order.status === 1 ? 'Đã nhận' : 'Đã hủy'
                  }</div>
                  <div className={`btn btn-${
                      order.payment === 0 ? 'pending' :
                      order.payment === 1 ? 'received' : 'cancel'
                  }`}>{
                      order.payment === 0 ? 'Đang xử lý' :
                      order.payment === 1 ? 'Đã thanh toán' : 'Không thành công'
                  }</div>
                </div>
            </div>
          
          { order.orderMoTo && order.orderMoTo.length > 0 && 
              <fieldset>
              <legend>Mo To:</legend>
              {
              order.orderMoTo.map((item, index) => (
                  <div key={index} className="item-content-items flex w-full">
                      <Link to={`/product/${item.productId}`} className="item-content w-full">
                          <img src={item.image} alt="" />
                          <div className="item-content-info w-1/2">
                              <p>{item.name}</p>
                              <i>Số lượng: x{item.quantity}</i>
                          </div>
                          <div className="">
                            Giá xe
                            { order.discount ? 
                                <div className="">
                                    <span className="line-through text-xs text-gray-500">{numberWithCommas(item.quantity * item.listedPrice)}₫</span>
                                    <p className="font-bold">{numberWithCommas((item.quantity * item.listedPrice) - (item.promotion_id?.rate / 100 * item.listedPrice))}₫</p>
                                </div>
                                : <p>{numberWithCommas(item.listedPrice)}₫</p>
                            }
                          </div>
                          <div className="item-content-price">
                              <p><b>{numberWithCommas(item.price)}₫</b></p>
                          </div>
                      </Link>
                      <div className="w-36 h-fit ">
                        {
                          item.status === 0 &&
                          <span
                            className="btn btn-info"
                            onClick={()=> showModalConfirmVehicle(item._id)}
                          >Bàn giao xe</span>
                        }
                        {
                          item.status === 1 &&
                          <span
                            className="btn btn-received"
                          >Đã bàn giao</span>
                        }
                        {
                          order.discount > 0 && 
                          <span className="btn btn-pending" onClick={() => showModalPromotion(item.promotion_id)}>Khuyến mãi</span>
                        }
                      </div>
                  </div>
                  ))
              }
                <div className='text-right'>  
                  {order.orderMoTo.status === 0 && <div className="btn btn-pending">Đang xử lý</div>}
                  {order.orderMoTo.status === 2 && <div className="btn btn-transport">Đã tiếp nhận</div>}
                  {order.orderMoTo.status === 3 && <div className="btn btn-transport">Đang vận chuyển</div>}
                  {order.orderMoTo.status === 1 && <div className="btn btn-received">Đã nhận</div>}
                  {order.orderMoTo.status === -1 && <div className="btn btn-cancel">Đã hủy</div>}
                </div>
              </fieldset>
          }
          { order.orderAccessory && 
          <fieldset>
              <legend>Phụ Tùng:</legend>
              {
                order.orderAccessory.map((item, index) => (
                  <div key={index} className="item-content-items flex w-full">
                      <Link to={`/accessory/${item.id}`} className="item-content w-full">
                          <img src={item.image} alt="" />
                          <div className="item-content-info">
                              <p>{item.name}</p>
                              <i>Số lượng: x{item.quantity}</i>
                          </div>
                          <div className="item-content-price">
                          { order.discount ? 
                            <div className="">
                                <span className="line-through text-xs text-gray-500">{numberWithCommas(item.quantity * item.price)}₫</span>
                                <p className="font-bold">{numberWithCommas((item.quantity * item.price) - (item.promotion_id?.rate / 100 * item.price))}₫</p>
                            </div>
                            : <p>{numberWithCommas(item.quantity * item.price)}₫</p>
                          }
                          </div>
                      </Link>
                      {
                        order.discount && 
                        <div className="w-32">
                          <span className="btn btn-pending" onClick={() => showModalPromotion(item.promotion_id)}>Khuyến mãi</span>
                        </div>
                      }
                  </div>
                  ))
              }
              <div className='text-right'>  
                {order.orderMoTo.status === 0 && <div className="btn btn-pending">Đang xử lý</div>}
                {order.orderMoTo.status === 2 && <div className="btn btn-transport">Đã tiếp nhận</div>}
                {order.orderMoTo.status === 3 && <div className="btn btn-transport">Đang vận chuyển</div>}
                {order.orderMoTo.status === 1 && <div className="btn btn-received">Đã nhận</div>}
                {order.orderMoTo.status === -1 && <div className="btn btn-cancel">Đã hủy</div>}
              </div>
          </fieldset>
          }
          <div className="flex justify-end w-full ">
            <div className="w-96">
                <div className="flex justify-between text-sm px-4 text-yellow-500">
                    Phí ship: <b>{numberWithCommas(order.fee ? order.fee : 0 )} ₫</b>
                </div>
                <div className="flex justify-between font-bold text-rose-400 px-4">
                    Giảm giá: <b>{numberWithCommas(order.discount ? order.discount : 0)}₫</b>
                </div>
                <div className="flex justify-between text-lg px-4 text-sky-500">
                    Giá trị thực tế: <b>{numberWithCommas(order.totalEstimate ? order.totalEstimate : 0 )} ₫</b>
                </div>
                <div className="flex justify-between item-total">
                    Giá trị đơn hàng: <b>{numberWithCommas(order.totalPrice)} ₫</b>
                </div>
              </div>
          </div>
        </div>
      }
      </div>
    </>
  )
}
