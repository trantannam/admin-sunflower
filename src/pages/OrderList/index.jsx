import { DataGrid } from '@material-ui/data-grid';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { TOAST_OPTIONS } from 'constants/productConstants';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { RiCheckboxCircleLine, RiDeleteBin6Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import numberWithCommas from 'utils/numberWithCommas';
import request from 'utils/request';

OrderList.propTypes = {};

function OrderList(props) {

    const [data, setData] = useState();
    const [delModal, setDelModal] = useState(false)

    const fetchOrderList = async () => {
        const orders = await request.get('/purchase-order');
        const orderList = orders.data.PO || [];
        setData(orderList);
    }
    useEffect(() => {
        fetchOrderList();
    }, []);

    const [curId, setCurId] = useState();

    const handleSetModalDelOrder = (id) => {
        setDelModal(true);
        setCurId(id)
    }


    const handleDelOrder = (id) => {
        request.delete(`/purchase-order/remove/${curId}`)
        .then(res => {
            if (res.data.success) {
                console.log(res.data)
                fetchOrderList();
                setDelModal(false);
                toast.success(res.data, {
                    ...TOAST_OPTIONS,
                })
            } else {
                toast.error(res.data);
            }
        }).catch(err => {
            toast.error('Không thể kết nối máy chủ');
        })
    }

    const handleChangeStatusOrder = (id, status) => {
        request.post(`/purchase-order/update-delivery-status`, { tranCode: id, deliveryStatus: status })
        .then(res => {
            if (res.data.success) {
              fetchOrderList()
              toast.success('Bạn đã xác nhận đơn hàng thành công.')
          }
        }).catch((e)=>{
          toast.error('Không thể kết nối máy chủ')
        })
    }

    const columns = [
        {
            field: 'id', headerName: 'Mã đơn hàng', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'userName', headerName: 'Tên người dùng', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.userName}</span>
                )
            }
        },
        {
            field: 'oder_date', headerName: 'Ngày đặt hàng', width: 220, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{moment(params.row.createdAt).format('DD-MM-YYYY hh:mm A')}</span>
                )
            }
        },
        {
            field: 'update_date', headerName: 'Ngày cập nhật', width: 220, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{moment(params.row.updatedAt).format('DD-MM-YYYY hh:mm A')}</span>
                )
            }
        },
        {
            field: 'totalPrice', headerName: 'Tổng tiền', width: 180, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{numberWithCommas(params.row.totalPrice)}</span>
                )
            }
        },
        {
            field: 'status', headerName: 'Trạng thái', width: 180, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="text">
                        {params.row.status === 0 &&
                            <div className="flex items-center">
                                <span className="btn btn-pending">Chờ xử lý</span>
                                <span className="btn item-received text-xl" onClick={() => handleChangeStatusOrder(params.row.id, 2)}>
                                    <RiCheckboxCircleLine />
                                </span>
                            </div>}
                        {params.row.status === 5 &&
                        <div className="flex items-center">
                            <span className="btn btn-pending">Yêu cầu hủy đơn</span>
                            <span className="btn item-received text-xl" onClick={() => handleChangeStatusOrder(params.row.id, -1)}>
                                <RiCheckboxCircleLine />
                            </span>
                        </div>}
                        {params.row.status === 1 && <div className="btn btn-transport">Đã tiếp nhận</div>}
                        {params.row.status === 2 && <div className="btn btn-transport">Đang vận chuyển</div>}
                        {params.row.status === 3 && <div className="btn btn-received">Hoàn tất</div>}
                        {params.row.status === -1 && <div className="btn btn-cancel">Đã hủy</div>}
                    </div>
                )
            }
        },
        {
            field: 'payment', headerName: 'Thanh toán', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="text relative">
                        {params.row.payment === "cod" && <div className="btn btn-pending">Thanh toán khi nhận hàng</div>}
                        {params.row.payment === "waiting for pay" && <div className="btn btn-transport">Chờ thanh toán</div>}
                        {params.row.payment === "paid" && <div className="btn btn-received">Đã thanh toán</div>}
                        {params.row.payment === "cancel" && <div className="btn btn-cancel">Không thành công</div>}
                    </div>
                )
            },
            editable: true
        },
        {
            field: 'admin', headerName: 'Actions', width: 150, headerClassName: 'text', renderCell: (params) => {
                return (
                    <>
                        <Link
                            to={`/orders/${params.row.id}`}
                            className="btn btn-info"
                        >
                            <i className="fas fa-info-circle"></i> Chi tiết
                        </Link>
                        <div
                            className="btn btn-cancel"
                            onClick={() => {
                                handleSetModalDelOrder(params.row.id)
                            }}
                        >
                            <RiDeleteBin6Line />
                        </div>
                    </>
                )
            }
        },
    ]
    return (
        <div className="order">
            <Modal show={delModal} setShow={setDelModal} size="sm:max-w-lg" title="Xác nhận xóa đơn hàng">
                <div className="mt-2">
                    <p className="text-xl text-gray-800">
                        Bạn có chắc chắn muốn xóa đơn hàng {curId}?
                    </p>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={ ()=> handleDelOrder() }
                    >
                        Xác nhận
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={()=> setDelModal(false)}
                    >
                        Bỏ qua
                    </button>
                </div>
            </Modal>
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách Đơn hàng</span>
            </div>
            <div className="userlist__main">
                {data ?
                    <DataGrid
                        disableSelectionOnClick
                        autoHeight
                        rows={data.map((order, index) => ({
                            id: order.tranCode,
                            userName: order.customer?.customer_name || '',
                            totalPrice: order.totalEstimate,
                            status: order.deliveryStatus,
                            payment: order.paymentStatus,
                            createdAt: order.createdAt,
                            updatedAt: order.updatedAt,
                        }))}
                        experimentalFeatures={{ newEditingApi: true }}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    /> : <LoadingBox />
                }
            </div>
        </div>
    );
}

export default OrderList;