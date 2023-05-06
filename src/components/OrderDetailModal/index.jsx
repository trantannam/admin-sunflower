import { orderUpdate, statusUpdate } from 'actions/orderActions';
import axios from 'axios';
import LoadingBox from 'components/LoadingBox';
import { TOAST_OPTIONS } from 'constants/configConstants';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import numberWithCommas from 'utils/numberWithCommas';
import moment from 'moment';


OrderDetailModal.propTypes = {};

function OrderDetailModal(props) {
    const { setdetailModal, curId, orderList, setData } = props;
    const [order, setOrder] = useState();
    const [updateOrder, setUpdateOrder] = useState({});

    const today = new Date();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOrderDetail = async () => {
            const orderD = await axios.get(`/orders/${curId}`);
            const orderDetail = orderD.data[0] || [];

            setOrder(orderDetail);

            if (orderDetail) {
                setUpdateOrder({
                    id: orderDetail._id,
                    fullName: orderDetail.shipingAddress.fullName,
                    phone: orderDetail.shipingAddress.phone,
                    address: orderDetail.shipingAddress.address,
                    commune: orderDetail.shipingAddress.commune,
                    district: orderDetail.shipingAddress.district,
                    city: orderDetail.shipingAddress.city,
                    createdAt: orderDetail.createdAt,
                    updatedAt: orderDetail.updatedAt,
                });
            }
        }
        fetchOrderDetail();
    }, [curId]);

    const handleStatusUpdate = (id, status, updatedAt) => {
        toast.warn('🚀🚀 Pending....', {
            ...TOAST_OPTIONS,
        });

        setTimeout(() => {
            dispatch(statusUpdate({ id, status, updatedAt }));

            const index = orderList?.findIndex(order => order._id === id);
            if (index !== -1) {
                const ordersUpdated = [...orderList];
                ordersUpdated[index].updatedAt = updatedAt;
                ordersUpdated[index].status = status;

                setData(ordersUpdated);
            }

            setdetailModal(false);
            toast.success('Update status success', {
                ...TOAST_OPTIONS,
            });

            clearTimeout();
        }, 1500)
    }

    const handleUpdateOrder = (e) => {
        e.preventDefault();
        toast.warn('🚀🚀 Pending....', {
            ...TOAST_OPTIONS,
        });
        setTimeout(() => {
            dispatch(orderUpdate(updateOrder));
            const index = orderList?.findIndex(order => order._id === curId);

            if (index !== -1) {
                const ordersUpdated = [...orderList];
                ordersUpdated[index].updatedAt = updateOrder.updatedAt;

                setData(ordersUpdated);
            }
            setdetailModal(false);
            toast.success('Update success', {
                ...TOAST_OPTIONS,
            });
            clearTimeout();
        }, 1000);

    }

    return (
        <>

            <div className="modal">
                <div className="modal__wrapper">
                    <div className="modal__box">
                        <div className="order__content">

                            <div className="modal__title">
                                Order Details
                                <div
                                    className="modal__close"
                                    onClick={() => setdetailModal(false)}
                                >
                                    <i className="far fa-times-circle"></i>
                                </div>
                            </div>

                            {order ? <>
                                <form onSubmit={handleUpdateOrder}>

                                    <div className="order__info">
                                        <div className="order__info-title">
                                            <h2>INFO</h2>
                                            {order.shipingAddress.ship === "home" ?
                                                (<div className="btn item-home">
                                                    <i className="fas fa-home"></i> Home
                                                </div>) :
                                                (<div className="btn item-store">
                                                    <i className="fas fa-store"></i> Store
                                                </div>)
                                            }
                                        </div>

                                        <div className="order__info-content">
                                            <div className="item">
                                                <p>User Name:</p>
                                                <input
                                                    type="text"
                                                    defaultValue={order.shipingAddress.fullName}
                                                    onChange={(e) => { setUpdateOrder({ ...updateOrder, fullName: e.target.value }) }}
                                                />

                                            </div>
                                            <div className="item">
                                                <p>Phone: </p>
                                                <input
                                                    type="text"
                                                    defaultValue={order.shipingAddress.phone}
                                                    onChange={(e) => { setUpdateOrder({ ...updateOrder, phone: e.target.value }) }}
                                                />
                                            </div>
                                            <div className="item">
                                                <p>Address: </p>
                                                <input
                                                    type="text"
                                                    defaultValue={order.shipingAddress.address}
                                                    onChange={(e) => { setUpdateOrder({ ...updateOrder, address: e.target.value }) }}
                                                />

                                            </div>
                                            <div className="item-city">
                                                <p>Commune: </p>
                                                <input
                                                    type="text"
                                                    defaultValue={order.shipingAddress.commune}
                                                    onChange={(e) => { setUpdateOrder({ ...updateOrder, commune: e.target.value }) }}
                                                />

                                                <p>District: </p>
                                                <input
                                                    type="text"
                                                    defaultValue={order.shipingAddress.district}
                                                    onChange={(e) => { setUpdateOrder({ ...updateOrder, district: e.target.value }) }}
                                                />
                                                <p>City: </p>
                                                <input
                                                    type="text"
                                                    defaultValue={order.shipingAddress.city}
                                                    onChange={(e) => { setUpdateOrder({ ...updateOrder, city: e.target.value }) }}
                                                />

                                            </div>
                                        </div>
                                        <div className="order__info-content">
                                            <div className="item">
                                                <p>ID Order:</p>
                                                <span>{order._id}</span>
                                            </div>
                                            <div className="item">
                                                <p>Order Date:</p>
                                                <input
                                                    type="datetime-local"
                                                    defaultValue={
                                                        moment(order.createdAt).format('YYYY-MM-DDThh:mm')
                                                    }
                                                    onChange={(e) => { setUpdateOrder({ ...updateOrder, createdAt: e.target.value }) }}
                                                />
                                            </div>
                                            <div className="item">
                                                <p>Date Update:</p>
                                                <input
                                                    type="datetime-local"
                                                    defaultValue={
                                                        moment(order.updatedAt).format('YYYY-MM-DDThh:mm')
                                                    }
                                                    onChange={(e) => { setUpdateOrder({ ...updateOrder, updatedAt: e.target.value }) }}
                                                />
                                            </div>
                                            <div className="item">
                                                <p>Satus:</p>

                                                {order.status === "pending" &&

                                                    (<>
                                                        <div className="btn item-pending">Pending</div>
                                                        <div className="update-status">
                                                            <div
                                                                className="btn btn-nextstatus"
                                                                onClick={() => handleStatusUpdate(order._id, 'transport', today)}>
                                                                Next Status
                                                            </div>
                                                        </div>
                                                    </>)

                                                }
                                                {order.status === "transport" &&
                                                    (<><div className="btn item-transport">Transport</div>
                                                        <div className="update-status">
                                                            <div
                                                                className="btn btn-nextstatus"
                                                                onClick={() => handleStatusUpdate(order._id, 'received', today)}>
                                                                Next Status
                                                            </div>
                                                        </div></>)

                                                }
                                                {order.status === "received" && <div className="btn item-received">Revieced</div>}
                                                {order.status === "cancle" && <div className="btn item-cancle">Cancled</div>}


                                            </div>

                                        </div>
                                    </div>
                                    <div className="orders__list">
                                        <div className="orders__list-title">
                                            <h2>Order List</h2>
                                        </div>
                                        <div className="orders__list-item">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>IMG</th>
                                                        <th>Name</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                        <th>Into Money</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        order.orderItems.map((order, index) => (
                                                            <tr key={index}>
                                                                <td>{order._id}</td>
                                                                <td>
                                                                    <img src={order.image} alt="" />
                                                                </td>
                                                                <td>{order.name}</td>
                                                                <td>{order.quantity}</td>
                                                                <td>{order.price}</td>
                                                                <td>{order.price * order.quantity}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="total">
                                        <b>TOTAL PRICE:
                                            <span className="price">
                                                {
                                                    numberWithCommas(
                                                        order.orderItems.reduce(
                                                            (sum, order) =>
                                                                sum +
                                                                order.price *
                                                                order.quantity
                                                            , 0)
                                                    )
                                                } VNĐ
                                            </span>
                                        </b>
                                    </div>
                                    <div className="bottom-config">
                                        {order.status !== 'cancle' &&
                                            <button
                                                type="submit"
                                                className="btn btn-update "
                                            // onClick={handleCloseModal}
                                            >
                                                <i className="fas fa-edit"></i> Update
                                            </button>
                                        }

                                        <div
                                            className="btn btn-cancle"
                                            onClick={() => setdetailModal(false)}
                                        >
                                            Cancle
                                        </div>
                                    </div>
                                </form>

                            </> : <LoadingBox />}

                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default OrderDetailModal;