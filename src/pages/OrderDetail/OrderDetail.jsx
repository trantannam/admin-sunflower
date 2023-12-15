// import InputField from "components/custom-field/InputField";
// import Modal from "components/Modal";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
// import { VscTriangleRight } from "react-icons/vsc";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import numberWithCommas from "utils/numberWithCommas";
import request from "utils/request";
import SelectedStatus from "./components/SelectedStatus";
import { apiURL } from "utils/callAPI";
import SelectedPaymentStatus from "./components/SelectedPaymentStatus";

export default function OrderDetail(props) {
  const { id } = useParams();
  const [order, setOrder] = useState()

  const [loading, setLoading] = useState(false)

  function fetchDetailOrder(id) {
    console.log("log")
    request.get(`/purchase-order/trancode/${id}`).then(res => {
      if (res.data.success) {
        const orderDetail = res.data.PO[0] || [];
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



  return (
    <>
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
            order &&
            <div>
              {
                (order?.deliveryStatus === 3 || order?.deliveryStatus === -1) ? '' :
                  <div className="flex items-center border-b mb-2">
                    <span>Thay đổi trạng thái Đơn hàng: </span>
                    <span className="w-64 mx-4">
                      <SelectedStatus id={id} order={order} loading={setLoading} refreshData={() => fetchDetailOrder(id)} />
                    </span>
                  </div>
              }
              {
                (order?.paymentStatus === "paid") ? '' :
                  <div className="flex items-center border-b mb-2">
                    <span>Thay đổi trạng Thanh toán: </span>
                    <span className="w-64 mx-4">
                      <SelectedPaymentStatus id={id} order={order} loading={setLoading} refreshData={() => fetchDetailOrder(id)} />
                    </span>
                  </div>
              }
              <div className="item-tag"
                style={{
                  color:
                    order?.deliveryStatus === 1 ? "green" :
                      order?.deliveryStatus === 3 ? "#d40a25" :
                        "#ffc318"
                }}
              >
                <i className="fas fa-tag"></i>
              </div>
              <div className="item-top">
                <div className="item-top-left">
                  <h2 className="text-lg"><b>Mã đơn hàng: </b> <i>{order.tranCode}</i></h2>
                  <p className="flex items-center">
                    <AiOutlineClockCircle className="mr-2" />
                    <i> Ngày đặt hàng: {moment(order.createdAt).format("DD/MM/YYYY hh:mm")}</i>
                  </p>
                </div>
                <div className="item-top-deliveryStatus_right">
                  <div style={{ display: "flex" }}>
                    <p style={{ padding: "10px 10px 0 0" }}>Trạng thái xử lý đơn hàng: </p>
                    <div
                      className={`btn btn-${order.deliveryStatus === 0 ? 'pending' :
                        order.deliveryStatus === 1 ? 'transport' :
                          order.deliveryStatus === 2 ? 'transport' :
                            order.deliveryStatus === 3 ? 'received' : 'cancel'
                        }`}
                    >
                      {
                        order.deliveryStatus === 0 ? 'Đang xử lý' :
                          order.deliveryStatus === 1 ? 'Đã tiếp nhận' :
                            order.deliveryStatus === 2 ? 'Đang vận chuyển' :
                              order.deliveryStatus === 3 ? 'Đã nhận' : 'Đã hủy'
                      }
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <p style={{ padding: "10px 10px 0 0" }}>Trạng thái thanh toán: </p>
                    <div
                      className={`btn btn-${order.paymentStatus === "cod" ? 'pending' :
                        order.paymentStatus === "waiting for pay" ? 'transport' :
                          order.paymentStatus === "paid" ? 'received' : 'cancel'}`}
                    >
                      {order.paymentStatus === "cod" ? 'Thanh toán khi nhận hàng' :
                        order.paymentStatus === "paid" ? 'Đã thanh toán' :
                          order.paymentStatus === "waiting for pay" ? 'Chờ thanh toán' : 'Không thành công'}
                    </div>
                  </div>
                </div>
              </div>

              {order.products && order.products.length > 0 &&
                <fieldset>
                  <legend>Danh sách sản phẩm:</legend>
                  {
                    order.products.map((item, index) => (
                      <div key={index} className="item-content-items flex w-full">
                        <Link to={`/product/${item._id}`} className="item-content w-full">
                          <img src={apiURL + item.image[0]} alt="" />
                          <div className="item-content-info w-1/2">
                            <p>{item.product_name}</p>
                            <i>Số lượng: x{item.quantity}</i>
                          </div>
                          <div className="">
                            Đơn giá
                            <p>{numberWithCommas(item.price)}₫</p>
                          </div>
                          <div className="item-content-price">
                            <p><b>{numberWithCommas(item.price * item.quantity)}₫</b></p>
                          </div>
                        </Link>
                      </div>
                    ))
                  }
                </fieldset>
              }
              <div className="flex justify-end w-full ">
                <div className="w-96">
                  <div className="flex justify-between text-sm px-4 text-yellow-500">
                    Phí ship: <b>0 ₫</b>
                  </div>

                  <div className="flex justify-between text-lg px-4 text-sky-500">
                    Giá trị thực tế: <b>{numberWithCommas(order.totalEstimate ? order.totalEstimate : 0)} ₫</b>
                  </div>
                  <div className="flex justify-between item-total">
                    Giá trị đơn hàng: <b>{numberWithCommas(numberWithCommas(order.totalEstimate))} ₫</b>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    </>
  )
}
