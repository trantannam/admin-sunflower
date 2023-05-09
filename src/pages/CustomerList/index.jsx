import { DataGrid } from '@material-ui/data-grid';
import { listUsers } from 'actions/userAction';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ImBin } from 'react-icons/im'
import LoadingBox from 'components/LoadingBox';
import { toast } from 'react-toastify';
import Modal from 'components/Modal';
import Register from 'pages/Register/Register';
import EditUser from './components/EditUser';
import { FaRegEdit } from 'react-icons/fa';
import request from 'utils/request.js';

const CustomerList = () => {
    document.title = "Admin - Khách hàng"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [idSelectDel, setIdSelectDel] = useState('');
    const [modalAddUser, setModalAddUser] = useState(false);
    const [modalEditUser, setModalEditUser] = useState(false);
    const [idUser, setIdUser] = useState();

    const fetchUserList = async () => {
        const customer = await axios.get('/customer');
        if (customer.data.success) {
            const data = customer.data.user
            setData(data);
        }
    }
    useEffect(() => {
        fetchUserList();
    }, []);

    const handleOpenModalDel = (id) => {
        setModal(true);
        setIdSelectDel(id);
    }
    
    const handleOpenModalEdit = (id) => {
        setModalEditUser(true);
        setIdUser(id);
    }

    const handleDelete = () => {
        request.delete(`/customer/deleteUser/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchUserList();
                setModal(false);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            toast.error('Không thể kết nối máy chủ');
        })
    }
    const columns = [
        {
            field: 'id', headerName: 'Mã KH', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên KH', width: 220, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnUser">
                        {/* <img className="columnUser__img" src={params.row.isAdmin ? params.row.image : params.row.image.split('\\').join('/')} alt="" /> */}
                        <span>
                            {params.row.name}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'login_name', headerName: 'Tên đăng nhập', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.login_name}</span>
                )
            }
        },
        {
            field: 'phone', headerName: 'Số điện thoại', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.phone}</span>
                )
            }
        },
        {
            field: 'address', headerName: 'Địa chỉ', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.address}</span>
                )
            }
        },
        {
            field: 'action', headerName: 'Actions', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <button className="btn btn-pending" onClick={()=> handleOpenModalEdit(params.row.id)}>
                            <FaRegEdit />
                        </button>
                        <button className="btn btn-cancel" 
                            onClick={()=> handleOpenModalDel(params.row.id)}>
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="userlist p-2">
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa khách hàng">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa khách hàng?
                </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={()=> handleDelete()}
                >
                    Xác nhận
                </button>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={()=> setModal(false)}
                >
                    Bỏ qua
                </button>
                </div>
            </Modal>
            <Modal show={modalAddUser} setShow={setModalAddUser} size="sm:max-w-3xl" title="">
                <Register setModal={setModalAddUser} refreshTable={fetchUserList}/>
            </Modal>
            <Modal show={modalEditUser} setShow={setModalEditUser} size="sm:max-w-3xl" title="">
                <EditUser id={idUser} setModal={setModalEditUser} refreshTable={fetchUserList}/>
            </Modal>
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách khách hàng</span>
                <button className="btn btn-info" onClick={()=>setModalAddUser(true)}>Thêm mới khách hàng</button>
            </div>
            <div className="userlist__main">
                {data ?
                    <DataGrid
                        autoHeight
                        rowHeight={56}
                        disableSelectionOnClick
                        rows={data && data.map((user, index) => ({
                            id: user._id,
                            name: user.name,
                            login_name: user.login_name,
                            phone: user.phone_number,
                            address: user.address}))}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />: <LoadingBox />
                }
            </div>
        </div>
    )
}

export default CustomerList
