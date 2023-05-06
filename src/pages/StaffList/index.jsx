import { DataGrid } from '@material-ui/data-grid';
import { listUsers } from 'actions/userAction';
import axios from 'axios';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditUser from './components/EditUser';
import Register from './components/Register';

const StaffList = () => {
    document.title = "Admin - Users"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [idSelectDel, setIdSelectDel] = useState('');
    const [modalEditUser, setModalEditUser] = useState(false);
    const [idUser, setIdUser] = useState();

    const fetchStaffList = async () => {
        const users = await axios.get('/staff');
        const userList = users.data.data || [];
        setData(userList);
    }

    useEffect(() => {
        fetchStaffList();
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
        axios.delete(`/staffs/deleteUser/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchStaffList()
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
            field: 'id', headerName: 'Mã NV', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {                 
            field: 'name', headerName: 'Tên NV', width: 220, headerClassName: 'text', renderCell: (params) => {
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
            field: 'email', headerName: 'Email', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.email}</span>
                )
            }
        },
        {
            field: 'phone', headerName: 'Số điện thoại', width: 250, headerClassName: 'text', renderCell: (params) => {
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
            field: 'status', headerName: 'Trạng thái', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">
                        {params.row.status === 2 && <div className="btn item-transport">Đang làm việc</div>}
                        {params.row.status === 0 && <div className="btn item-received">Đang hoạt động</div>}
                        {params.row.status === 3 && <div className="btn item-cancle">Nghỉ</div>}
                    </span>
                )
            }
        },
        {
            field: 'action', headerName: 'Actions', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <button className="btn btn-pending"  onClick={()=> handleOpenModalEdit(params.row.id)}>
                            <FaRegEdit />
                        </button>
                        <button className="btn btn-cancel" onClick={() => handleOpenModalDel(params.row.id)}>
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="userlist p-2">
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa nhân viên">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa nhân viên?
                </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={ ()=> handleDelete() }
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
            <Modal show={modal} setShow={setModal} size="sm:max-w-3xl" title="">
                <Register setModal={setModal} refreshTable={fetchStaffList}/>
            </Modal>
            <Modal show={modalEditUser} setShow={setModalEditUser} size="sm:max-w-3xl" title="">
                <EditUser id={idUser} setModal={setModalEditUser} refreshTable={fetchStaffList}/>
            </Modal>
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách nhân viên</span>
                <div>
                    <Link to='/staff/time-service' className="btn btn-pending">Lịch bảo dưỡng</Link>
                    <button className="btn btn-info ml-4" onClick={()=>setModal(true)}>Thêm mới nhân viên</button>
                </div>
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
                            image: user.image,
                            email: user.email,
                            phone: user.phone,
                            address: user.address,
                            status: user.status,
                            isAdmin: user.isAdmin }))}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />: <LoadingBox />
                }
            </div>
        </div>
    )
}

export default StaffList
