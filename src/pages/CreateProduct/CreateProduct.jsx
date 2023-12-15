import SelectField from 'components/custom-field/SelectField';
import { useEffect, useState } from 'react';
import { ImFolderUpload } from 'react-icons/im';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import request from 'utils/request';

const Product = () => {
    document.title = 'Admin - Thêm sản phẩm';
    const [imageProduct, setImageProduct] = useState('');
    const [typeOption, setTypeOption] = useState([])
    const [typeSelected, setTypeSelected] = useState({
        label: '-- Loại sản phẩm --',
        value: 0
    });

    const [img, setImg] = useState("");

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
        product_name: '',
        image: '',
        amount: 0,
        price: '',
        product_type: '',
        description: '',
    });

    const handleSetTypeForm = (e) => {
        setTypeSelected(e);
        setFormData(prev => ({
            ...prev,
            product_type: e.value
        }))
    }
    const navigate = useNavigate();

    const submitInfo = (e) => {
        e.preventDefault();
        let count = 0;
        Object.entries(formData).forEach(([key, val]) => {
            if (!val) {
                return count
            } else {
                count++;
            }
        })

        if (count === 6) {
            const im = new FormData();
            im.append('type', 'img')
            im.append("image", img, img.name);
            console.log("im", im)
            request.post("/product/uploadImgProduct", im)
                .then(res => {
                    if (res.data.success) {
                        setFormData(prev => ({ ...prev, image: res.data.uri }))
                        console.log("formdata", formData)
                        request.post('/product/create', formData)
                            .then(res => {
                                if (res.data.success) {
                                    toast.success('Thêm mới thành công.')
                                    // console.log("res", res.data.product)
                                    return navigate(`/product/${res.data.product._id}`)
                                }
                            })
                    }
                })
                .catch(e => {
                    toast.error(e.message)
                })
        } else {
            return toast.warn('Vui lòng điền đầy đủ thông tin')
        }
    }

    const handleInput = async (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.onloadend = () => {
                setImageProduct(reader.result)
                setFormData(prev => ({ ...prev, image: file.name }))
                setImg(file)
            }
            reader.readAsDataURL(file)
        }
        // console.log("image", formData)
    }

    return (
        <div className="product">
            <div className="product__title">
                <div className="product__title-edit uppercase">Thông tin sản phẩm</div>
            </div>
            <div className="product__content">
                <form className="updateForm xl:flex-row md:flex-col sm:flex-col" onSubmit={submitInfo} >
                    {/* left */}
                    <div className="updateForm__left w-2/5 lg:w-full md:lg:w-full md:w-full">
                        <div className="updateForm__left-item">
                            <label htmlFor="name" className="item__label">Tên sản phẩm</label>
                            <input
                                id="name"
                                className="item__input"
                                type="text"
                                value={formData?.product_name}
                                onChange={e => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                            />
                        </div>
                        <label className="item__label">Hình sản phẩm: </label>
                        <div className="updateForm__left-item fileImage">
                            <div className="w-3/5">
                                <img className="leftImg" src={imageProduct} alt="" />
                            </div>
                            <div className="w-2/5 w-full">
                                <div className="flex">
                                    <label htmlFor="product_img" className="choose border w-full border-gray-300 px-8 py-2 text-white hover:cursor-pointer text-2xl rounded-md bg-sky-500 hover:bg-sky-400">
                                        <ImFolderUpload />
                                    </label>
                                    <input
                                        className="leftFile"
                                        accept="image/png, image/jpeg"
                                        id="product_img"
                                        hidden
                                        type="file"
                                        onChange={e => handleInput(e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* right  */}
                    <div className="updateForm__right w-3/5 lg:w-full md:lg:w-full md:w-full">
                        <div className="updateForm__right-item">
                            <label htmlFor="price" className="item__label">Giá sản phẩm: (₫)</label>
                            <input
                                id="price"
                                className="item__input"
                                type="text"
                                value={formData?.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            />
                        </div>
                        <div className="updateForm__right-item">
                            <label htmlFor="price" className="item__label">Số lượng sản phẩm:</label>
                            <input
                                id="price"
                                min="0"
                                className="item__input"
                                type="number"
                                value={formData?.amount}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            />
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
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <button type="submit" className="rightUpdate">Thêm sản phẩm</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Product
