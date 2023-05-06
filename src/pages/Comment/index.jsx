// import { useDispatch } from 'react-redux';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import Modal from 'components/Modal';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ImBin } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

const Comment = () => {
    moment.locale("vn")
    document.title = "Admin - comment";
    const { id } = useParams();
    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [idSelectDel, setIdSelectDel] = useState('');
    const [modalDetailComment, setModalDetailComment] = useState(false);
    const [detailComment, setDetailComment] = useState(false);
    const user = useSelector(state => state.userSignin)

    const fetchRating = async (id) => {
        const data = await axios.get(`/product-comment/${id}`);
        setData(data.data.data);
    }
    useEffect(() => {
        fetchRating(id);
    }, [id]);

    const handleOpenModalDel = (id) => {
        setModal(true);
        setIdSelectDel(id);
    }

    const columns = [
        {
            field: 'id', headerName: 'ID', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Khách hàng', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnUser">
                        <img className="columnUser__img w-5 h-5 rounded-full" src={params.row.image} alt="" />
                        <span>
                            {params.row.name}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'time', headerName: 'Thời gian', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.time} <i className="fas fa-star review-star"></i></span>
                )
            }
        },
        {
            field: 'note', headerName: 'Nội dung', width: 400, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.note}</span>
                )
            }
        },
        {
            field: 'action', headerName: 'Actions', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <button className="btn btn-info" onClick={()=> handleOpenModalDetail(params.row)}>Chi tiết</button>
                        <button className="behavior__delete" 
                            onClick={()=> handleOpenModalDel(params.row.productId)}>
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]
    const handleDelete = () => {
        axios.delete(`/product-comment/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchRating(id);
                setModal(false);
                toast.success(res.data.data);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            toast.error('Không thể kết nối máy chủ');
        })
    }

    const handleOpenModalDetail = (repComment) => {
        setModalDetailComment(true)
        setDetailComment(repComment)
    }
    const [isReplyComment, setIsReplyComment] = useState(false);
    const [commentRepValue, setCommentReptValue] = useState('')

    const handleReplyComment = (id, value) => {
        const data = {
            id,
            user: {
                name: user.name,
                avatar: user.image
            },
            noi_dung: value,
            dateTime: moment().format('L')
        }
        if (value) {
            axios.post('/product-comment/reply', data)
            .then(res => {
                if(res.data.success) {
                    detailComment.rep_comment.push(data);
                    setIsReplyComment(false)
                    setCommentReptValue('')
                    toast.success('Bình luận thành công')
                }
            }).catch(e=> {
                console.log(e.message)
            })
        } else {
            toast.warning('Bình luận rỗng!')
        }
    }
    return (
        <div className="rating">
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa bình luận">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa bình luận?
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
            <Modal show={modalDetailComment} setShow={setModalDetailComment} size="sm:max-w-4xl" title="">
               <div className="max-h-[600px] overflow-auto">
                <div className="">
                    <div className='rounded-lg flex items-center'>
                        <img className="w-10 h-10 rounded-full" src={detailComment?.image} alt="" />
                        <p>
                            <b>{detailComment?.name}</b>
                            <span className="text-gray-400 pl-2">{detailComment && moment(detailComment.time).startOf('minute').fromNow()}</span>
                        </p>
                    </div>
                    <p className='pl-10'>{detailComment?.note}</p>
                </div>
                <button className='btn btn-info' onClick={()=>setIsReplyComment(prev=> !prev)}> Trả lời</button>
                {isReplyComment &&
                    <div className="relative pl-16 mb-10">
                        <input
                            type="text"
                            name="price"
                            id="price"
                            required
                            onChange={(e) => setCommentReptValue(e.target.value)}
                            value={commentRepValue}
                            className="border focus:ring-indigo-300 focus:border-indigo-300 block w-full pl-7 py-2 pr-12 border-gray-300 rounded-md"
                            placeholder="Nhập nội dung bình luận của bạn"
                        />
                        <div
                            className="absolute top-1.5 right-4 bg-sky-400 text-white p-1 cursor-pointer rounded"
                            onClick={() => handleReplyComment(detailComment?.id, commentRepValue)}
                        >
                            Gửi bình luận
                        </div>
                    </div>
                }
                <h3 className="font-bold">Trả lời</h3>
                <div className="border-l-2 h-full w-full">
                    {detailComment && detailComment.repComment.map((item) => (
                    <div className="pl-4 w-full">
                        <div className="columnUser mb-2 p-2 border">
                            <div className='rounded-lg flex flex-wrap items-center'>
                                <img className="w-10 h-10 rounded-full" src={item.user.avatar} alt="" />
                                <p>
                                    <b>{item.user.name}</b>
                                    <span className="text-gray-400 pl-2">{item && moment(item.dateTime).startOf('minute').fromNow()}</span>
                                </p>
                            </div>
                            <p className='pl-10'>{item.noi_dung}</p>
                        </div>
                    </div>
                    ))}
                </div>
               </div>
            </Modal>
            <div className="rating__header">
                Bình luận
            </div>
            {
                data &&
                    <DataGrid
                        autoHeight
                        disableSelectionOnClick
                        rows={data && data.map((data) => ({
                            id: data._id,
                            name: data.user.name,
                            image: data.user.image,
                            time: data.createdAt,
                            note: data.noi_dung,
                            productId: data.productId,
                            repComment: data.rep_comment
                        }))}
                        experimentalFeatures={{ newEditingApi: true }}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                    />
            }

        </div >
    )
}

export default Comment
