import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { ImBin } from 'react-icons/im';
import { toast } from 'react-toastify';

const VehicleType = () => {
    document.title = "Admin - Brand"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [nameVehicleType, setNameVehicleType] = useState(false);
    const [idSelectDel, setIdSelectDel] = useState('');
    const [modalAddBrand, setModalAddVehicle] = useState(false);
    const [modalEditBrand, setModalEditBrand] = useState(false);
    const [idVehicleType, setIdVehicleType] = useState();

    const fetchVehicleTypeList = () => {
        setData(null)
        axios.get('/vehicle-type')
        .then(res => {
            if(res.data.success) {
                setData(res.data.data)
            }
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        fetchVehicleTypeList();
    }, []);

    const handleOpenModalDel = (id) => {
        setModal(true);
        setIdSelectDel(id);
    }
    
    const handleOpenModalEdit = (id) => {
        axios.get(`/vehicle-type/${id}`, { name: nameVehicleType })
        .then(res=> {
            if(res.data.success) {
                setIdVehicleType(res.data.data);
                setModalEditBrand(true);
            }
        }).catch((e) => {
            console.log(e.message)
        })
    }
    const handleDelete = () => {
        axios.delete(`/vehicle-type/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchVehicleTypeList();
                setModal(false);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            toast.error('Không thể kết nối máy chủ');
        })
    }

    const handleAddVehicle = () => {
        axios.post('/vehicle-type/create', { name: nameVehicleType })
        .then(res => {
            if (res.data.success) {
                fetchVehicleTypeList();
                setModalAddVehicle(false);
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
            field: 'id', headerName: 'Mã loại xe', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên loại xe', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnUser">
                        <span>
                            {params.row.name}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'action', headerName: 'Actions', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <button className="btn btn-pending" onClick={()=> handleOpenModalEdit(params.row.id)}>Edit</button>
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
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa loại xe">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa loại xe?
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
            <Modal show={modalAddBrand} setShow={setModalAddVehicle} size="sm:max-w-lg" title="Thêm loại xe">
                <div className="form__item">
                    <label htmlFor="name" className="form__item__label text-lg font-bold">Tên loại xe</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="brand"
                        placeholder="Tên loại xe"
                        onChange={(e) => setNameVehicleType(e.target.value) } />
                </div>
                <div className="w-full text-right">
                    <button className="btn btn-info" onClick={handleAddVehicle}>Thêm mới</button>
                </div>
            </Modal>
            <Modal show={modalEditBrand} setShow={setModalEditBrand} size="sm:max-w-lg" title="Thêm loại xe">
                <div className="form__item">
                    <label htmlFor="name" className="form__item__label text-lg font-bold">Chỉnh sửa loại xe</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="brand"
                        placeholder="Tên loại xe"
                        value={idVehicleType?.name}
                        onChange={(e) => setNameVehicleType(e.target.value) } />
                </div>
                <div className="w-full text-right">
                    <button className="btn btn-info" onClick={handleAddVehicle}>Thêm mới</button>
                </div>
            </Modal>
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách Loại Xe</span>
                <button className="btn btn-info" onClick={()=>setModalAddVehicle(true)}>Thêm mới loại xe</button>
            </div>
            <div className="userlist__main">
                {data ?
                    <DataGrid
                        autoHeight
                        rowHeight={56}
                        disableSelectionOnClick
                        rows={data && data.map((brand, index) => ({
                            id: brand._id,
                            name: brand.name
                            })
                        )}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />: <LoadingBox />
                }
            </div>
        </div>
    )
}

export default VehicleType
