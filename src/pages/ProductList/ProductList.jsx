import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { ImBin } from 'react-icons/im';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import numberWithCommas from 'utils/numberWithCommas';

const ProductList = () => {

    document.title = "Admin - Products"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [idSelectDel, setIdSelectDel] = useState('');

    const fetchProductList = async () => {
        const products = await axios.get('/product');
        const ProductList = products.data.data || [];
        setData(ProductList);
    }
    useEffect(() => {
        fetchProductList();
    }, []);

    const handleOpenModalDel = (id) => {
        setModal(true);
        setIdSelectDel(id);
    }

    const handleDelete = (id) => {
        axios.delete(`/product/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchProductList();
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
            field: 'id', headerName: 'Mã SP', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên sản phẩm', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnImg">
                        <img className="columnImg__img" src={params.row.img} alt="" />
                        <span>
                            {params.row.name}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'type', headerName: 'Loại hoa', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.type}</span>
                )
            }
        },
        {
            field: 'description', headerName: 'Mô tả', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.description}</span>
                )
            }
        },
        {
            field: 'price', headerName: 'Giá', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">
                        {numberWithCommas(params.row.price)}₫
                    </span>
                )
            }
        },
        {
            field: 'isAdmin', headerName: 'Actions', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <Link to={`/product/${params.row.id}`}>
                            <button className="btn btn-info">Chi tiết</button>
                        </Link>
                        <button className="btn btn-cancel"
                            onClick={() => handleOpenModalDel(params.row.id)}
                            >
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="productlist">
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa sản phẩm">
                <div className="mt-2">
                <p className="text-lg text-gray-800">
                    Bạn có chắc chắn muốn xóa sản phẩm này?
                </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={ ()=> handleDelete() }
                >
                    Xác nhận
                </button>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={()=> setModal(false)}
                >
                    Bỏ qua
                </button>
                </div>
            </Modal>
            <div className="productlist__header">
                <span className="productlist__header-title">Danh sách sản phẩm</span>
                <Link to='/create-product' >
                    <button className="btn btn-info">Thêm sản sản phẩm</button>
                </Link>
            </div>
            {data ?
                <DataGrid
                    disableSelectionOnClick
                    rows={data && data.map((item, index) => ({
                        id: item._id,
                        name: item.product_name,
                        img: item.image,
                        price: item.price,
                        type: item.product_type.name || '',
                        description: item.description
                    }))}
                    columns={columns}
                    pageSize={10}
                    autoHeight
                    // rowsPerPageOptions={[5]}
                    rowsPerPageOptions={[10]}
                />: <LoadingBox />
            }
        </div>
    )
}

export default ProductList
