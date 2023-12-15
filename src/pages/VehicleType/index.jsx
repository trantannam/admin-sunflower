import { DataGrid } from '@material-ui/data-grid';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { ImBin } from 'react-icons/im';
import { toast } from 'react-toastify';
import request from 'utils/request';

const VehicleType = () => {
    document.title = "Admin - Loại sản phẩm"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [nameType, setNameType] = useState(false);
    const [idSelectDel, setIdSelectDel] = useState('');
    const [modalAddType, setModalAddType] = useState(false);
    const [modalEditType, setModalEditType] = useState(false);
    const [idType, setIdType] = useState();

    const fetchVehicleTypeList = () => {
        setData(null)
        request.get('/product-type')
            .then(res => {
                if (res.data.success) {
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
        request.put(`/product-type/update/${id}`, { name: nameType })
            .then(res => {
                if (res.data.success) {
                    setIdType(res.data.data);
                    setModalEditType(true);
                }
            }).catch((e) => {
                console.log(e.message)
            })
    }
    const handleDelete = () => {
        request.delete(`/product-type/delete/${idSelectDel}`)
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
        request.post('/product-type/create', { name: nameType })
            .then(res => {
                if (res.data.success) {
                    fetchVehicleTypeList();
                    setModalAddType(false);
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
            field: 'id', headerName: 'Mã loại sản phẩm', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên loại sản phẩm', width: 300, headerClassName: 'text', renderCell: (params) => {
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
                        <button className="btn btn-pending" onClick={() => handleOpenModalEdit(params.row.id)}>Edit</button>
                        <button className="btn btn-cancel"
                            onClick={() => handleOpenModalDel(params.row.id)}>
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="userlist p-2">
            {/* Popup delete */}
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa loại sản phẩm">
                <div className="mt-2">
                    <p className="text-xl text-gray-800">
                        Bạn có chắc chắn muốn xóa loại sản phẩm?
                    </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => handleDelete()}
                    >
                        Xác nhận
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setModal(false)}
                    >
                        Bỏ qua
                    </button>
                </div>
            </Modal>

            {/* Popup add */}
            <Modal show={modalAddType} setShow={setModalAddType} size="sm:max-w-lg" title="Thêm loại sản phẩm">
                <div className="form__item">
                    <label htmlFor="name" className="form__item__label text-lg font-bold">Tên loại sản phẩm</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="brand"
                        placeholder="Tên loại sản phẩm"
                        onChange={(e) => setNameType(e.target.value)} />
                </div>
                <div className="w-full text-right">
                    <button className="btn btn-info" onClick={handleAddVehicle}>Thêm mới</button>
                </div>
            </Modal>

            {/* Popup fix */}
            <Modal show={modalEditType} setShow={setModalEditType} size="sm:max-w-lg" title="Chỉnh sửa">
                <div className="form__item">
                    <label htmlFor="name" className="form__item__label text-lg font-bold">Tên loại sản phẩm</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="brand"
                        placeholder="Nhập tên loại sản phẩm mới"
                        value={idType?.name}
                        onChange={(e) => setNameType(e.target.value)} />
                </div>
                <div className="w-full text-right">
                    <button className="btn btn-info" onClick={handleAddVehicle}>Chỉnh sửa</button>
                </div>
            </Modal>
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách loại sản phẩm</span>
                <button className="btn btn-info" onClick={() => setModalAddType(true)}>Thêm mới loại sản phẩm</button>
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
                    /> : <LoadingBox />
                }
            </div>
        </div>
    )
}

export default VehicleType
