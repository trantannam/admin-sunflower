import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';


const Reviews = () => {

    document.title = "Admin - Đánh giá";
    const { id } = useParams();
    const [review, setReview] = useState([]);

    useEffect(() => {
        const fetchReview = async () => {
            const rate = await axios.get(`/product-review/${id}`);
            setReview(rate.data.data);
        }
        fetchReview();
    }, [id]);

    const columns = [
        {
            field: 'id', headerName: 'ID', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Khách hàng', width: 300, headerClassName: 'text', renderCell: (params) => {
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
            field: 'review', headerName: 'Số điểm', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.review} <i className="fas fa-star review-star"></i></span>
                )
            }
        },
        {
            field: 'time', headerName: 'Thời gian', width: 200, headerClassName: 'text', renderCell: (params) => {
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
    ]

    return (
        <div className="rating">
            <div className="rating__header">
                Đánh giá sản phẩm
            </div>
            {
               review &&
                    <DataGrid
                        disableSelectionOnClick
                        autoHeight
                        rows={review && review.map((data, index) => ({
                            id: data._id,
                            name: data.user.name,
                            image: data.user.image,
                            review: data.rate_number,
                            time: data.createdAt,
                            note: data.note
                        }))}
                        experimentalFeatures={{ newEditingApi: true }}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
            }
        </div >
    )
}

export default Reviews
