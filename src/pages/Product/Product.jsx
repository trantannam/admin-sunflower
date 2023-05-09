import axios from 'axios';
import SelectField from 'components/custom-field/SelectField';
import LoadingBox from 'components/LoadingBox';
import { useEffect, useState } from 'react';
import { ImFolderUpload } from 'react-icons/im';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import request from 'utils/request.js';

const Product = () => {
    document.title = 'Admin - Thông tin sản phẩm';
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loadingPage, setLoadingPage] = useState(false);
    const [imageProduct, setImageProduct] = useState('');

    const [typeOption, setTypeOption] = useState([])
    const [typeSelected, setTypeSelected] = useState({
        label: '-- Loại sản phẩm --',
        value: 0
    });
    useEffect(() => {
        request.get('/product-type')
        .then(res => {
            if (res.data.success) {
                const data = res.data.data
                const options = data.map((item) => ({
                    label: item.name,
                    value: item._id
                }))
                setTypeOption(options)
            }
        }).catch()
    }, [])

    const [formData, setFormData] = useState({
        name: '',
        img: '',
        product_type: '',
        amount: 0,
        price: '',
        description: '',
    });

    const handleSetTypeForm = (e) => {
        setTypeSelected(e);
        setFormData(prev => ({
            ...prev,
            product_type: e.value
        }))
    }

    function handleImageChange (e) {
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.onloadend = () => {
                setImageProduct(e.target.files[0])
                setFormData(prev => ({...prev, img: reader.result}))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleFetchDataProduct = (id) => {
        setLoadingPage(true)
        request.get(`/product/${id}`)
        .then(res => {
            if(res.data.success) {
                const data = res.data.data;
                setProduct(data);
                setFormData(() => ({
                    img: data.image || '',
                    name: data.product_name || '',
                    amount: data.amount || '',
                    product_type: data.product_type._id || '',
                    price: data.price || '',
                    description: data.description || '',
                }))
                setTypeSelected({
                    label: data.product_type.name,
                    value: data.product_type._id
                })
            }
            setLoadingPage(false)
        }).catch((e)=> console.log(e))
    }

    useEffect(() => {
        handleFetchDataProduct(id);
    }, [id]);

    const submitInfo = (e) => {
        e.preventDefault();
        request.post(`/product/${id}/update`, {...formData, img: ''})
        .then(res=>{
            if(res.data.success) {
                setProduct(res.data.data)
                toast.success('Cập nhật thành công.')
            }
        })
        .catch(e => {
            toast.error(e.message)
        })
        if (imageProduct) {
            const fi = new FormData()
            fi.append('type', 'img')
            fi.append('id', id)
            fi.append('image', imageProduct, imageProduct.name)
            request.put(`/product/${id}/update-image`, fi)
            .then(res=> {
                if(!res.data.success) {
                    toast.error('Hình ảnh cập nhật không thành công.')
                    setImageProduct('')
                    
                }
            }).catch(e=>{
                toast.error(e.message)
            })
        }
    }

    return (
        <>
            {
                !product && loadingPage ?  <LoadingBox /> :
                <div className="product">
                    <div className="product__title">
                        <div className="product__title-edit uppercase">Thông tin sản phẩm</div>
                    </div>
                    <div className="w-full flex justify-end items-center ">

                        <div className="updateForm__right-item">
                            <Link to={`/review/${id}`}>
                                <button className="btn btn-info">Đánh giá</button>
                            </Link>

                            <Link to={`/comment/${id}`}>
                                <button className="btn btn-pending">Bình luận</button>
                            </Link>
                        </div>
                    </div>
                    <div className="product__content">
                        <form className="updateForm xl:flex-row md:flex-col sm:flex-col" onSubmit={submitInfo} >
                            {/* left */}
                            <div className="updateForm__left w-2/5 lg:w-full md:lg:w-full md:w-full">
                                <div className="updateForm__left-item">
                                    <label className="item__label">Mã sản phẩm: </label>
                                    <span className="id w-full">{id}</span>
                                </div>
                                <div className="updateForm__left-item">
                                    <label htmlFor="name" className="item__label">Tên sản phẩm</label>
                                    <input id="name" className="item__input" type="text" value={formData.name || ''} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value}))} />
                                </div>
                                <label className="item__label">Hình sản phẩm: </label>
                                <div className="updateForm__left-item fileImage">
                                    <div className="w-1/2">
                                        <img className="leftImg" src={formData.img} alt="" />
                                    </div>
                                    <div className="w-1/2 h-full py-4">
                                        <div className="">
                                            <label htmlFor="product_img" className="choose border w-full border-gray-300 px-8 py-2 text-white hover:cursor-pointer text-2xl rounded-md bg-sky-500 hover:bg-sky-400">
                                                <ImFolderUpload />
                                            </label>
                                            <input
                                                className="leftFile"
                                                accept="image/*"
                                                id="product_img"
                                                hidden
                                                type="file"
                                                onChange={e =>handleImageChange(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* right  */}
                            <div className="updateForm__right w-3/5 lg:w-full md:lg:w-full md:w-full">
                                <div className="updateForm__right-item">
                                    <label htmlFor="price" className="item__label">Giá sản phẩm: (₫)</label>
                                    <input id="price" className="item__input" type="text" value={formData?.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value}))}/>
                                </div>
                                <div className="updateForm__right-item">
                                    <label htmlFor="price" className="item__label">Số lượng sản phẩm:</label>
                                    <input id="price" min="0" className="item__input" type="number" value={formData?.amount} onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value}))}/>
                                </div>
                                <div className="updateForm__left-item mb-2">
                                    <label className="item__label">Loại Hoa</label>
                                    <SelectField
                                        className="w-full"
                                        options={typeOption}
                                        selected={typeSelected}
                                        onChange={handleSetTypeForm} 
                                    />
                                </div>
                                <div className="updateForm__right-item">
                                    <label htmlFor="description" className="item__label">Mô tả chi tiết</label>
                                    <textarea
                                        id="description"
                                        className="w-full border rounded-lg p-2 h-32 resize-none border-blue-700 outline-none"
                                        type="text"
                                        value={formData?.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value}))}/>
                                </div>
                                <button type="submit" className="rightUpdate">Cập nhật</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default Product
