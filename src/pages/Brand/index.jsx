import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import SelectField from 'components/custom-field/SelectField';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { toast } from 'react-toastify';

const BrandList = () => {
    document.title = "Admin - Brand"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 0
    });
    const [idSelectDel, setIdSelectDel] = useState('');
    const [modalAddBrand, setModalAddBrand] = useState(false);
    const [modalEditBrand, setModalEditBrand] = useState(false);

    const listType= [
    {
        label: 'Mo To',
        value: 0
    },
    {
        label: 'Phụ tùng',
        value: 1
    }];
    const [userSelected, setUserSelected] = useState(listType[0])
    const handleSelectType= (e) => {
        setUserSelected(e)
        setFormData(prev=> ({
          ...prev,
          type: e.value
        }))
      }
    const fetchBrandList = () => {
        setData(null)
        axios.get('/brand')
        .then(res => {
            if(res.data.success) {
                setData(res.data.data)
            }
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        fetchBrandList();
    }, []);

    const handleOpenModalDel = (id) => {
        setModal(true);
        setIdSelectDel(id);
    }
    
    const handleOpenModalEdit = (id) => {
        axios.get(`/brand/${id}`, formData)
        .then(res=> {
            if(res.data.success) {
                setFormData(prev => ({...prev, 
                    name: res.data.data.name,
                    type: res.data.data.type
                }))
                setModalEditBrand(true);
            }
        }).catch((e) => {
            console.log(e.message)
        })
    }

    const handleDelete = () => {
        axios.delete(`/brand/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchBrandList();
                setModal(false);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            toast.error('Không thể kết nối máy chủ');
        })
    }

    const handleAddBrand = () => {
        axios.post('/brand/create', formData)
        .then(res => {
            if (res.data.success) {
                fetchBrandList();
                setModalAddBrand(false);
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
            field: 'id', headerName: 'Mã Thương hiệu', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên Thương hiệu', width: 300, headerClassName: 'text', renderCell: (params) => {
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
            field: 'type', headerName: 'Loại', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnUser">
                        {params.row.type === 0 && <span className="btn btn-info">Mo To</span>}
                        {params.row.type === 1 && <span className="btn btn-pending">Phụ tùng</span>}
                    </div>
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
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa thương hiệu">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa Thương hiệu?
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
            <Modal show={modalAddBrand} setShow={setModalAddBrand} size="sm:max-w-lg" title="Thêm Thương hiệu mới">
                <div className="form__item">
                    <label htmlFor="name" className="form__item__label text-lg font-bold">Tên thương hiệu</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="brand"
                        placeholder="Tên thương hiệu"
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value})) } />
                </div>
                <SelectField
                    label="Người dùng" //lable name
                    options={listType}
                    selected={userSelected}
                    onChange={handleSelectType}
                  />
                <div className="w-full text-right mt-10">
                    <button className="btn btn-info" onClick={handleAddBrand}>Thêm mới</button>
                </div>
            </Modal>
            <Modal show={modalEditBrand} setShow={setModalEditBrand} size="sm:max-w-lg" title="Thêm Thương hiệu mới">
                <div className="form__item">
                    <label htmlFor="name" className="form__item__label text-lg font-bold">Chỉnh sửa thương hiệu</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="brand"
                        value={formData?.name}
                        placeholder="Tên thương hiệu"
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value})) } />
                </div>
                <SelectField
                    label="Người dùng" //lable name
                    options={listType}
                    selected={userSelected}
                    onChange={handleSelectType}
                  />
                <div className="w-full text-right mt-10">
                    <button className="btn btn-info" onClick={handleAddBrand}>Thêm mới</button>
                </div>
            </Modal>
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách Thương hiệu</span>
                <button className="btn btn-info" onClick={()=>setModalAddBrand(true)}>Thêm mới thương hiệu</button>
            </div>
            <div className="userlist__main">
                {data ?
                    <DataGrid
                        autoHeight
                        rowHeight={56}
                        disableSelectionOnClick
                        rows={data && data.map((brand, index) => ({
                            id: brand._id,
                            name: brand.name,
                            type: brand.type
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

export default BrandList
