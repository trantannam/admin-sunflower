import request from 'utils/request';
import { useEffect, useState } from 'react';
import { AiOutlineFileProtect } from 'react-icons/ai';
import {
    FaFileInvoiceDollar
} from 'react-icons/fa';
import { RiLuggageCartLine, RiUserAddFill } from 'react-icons/ri';
import numberWithCommas from 'utils/numberWithCommas';

const FeaturedInfo = () => {
    const [totalSales, setTotalSales] = useState();

    useEffect(() => {
        const fetchDataHome = async () => {
            const sales = await request.get("/dashboard/summary");
            const dataSales = sales.data.summary || [];
            setTotalSales(dataSales)
        };

        fetchDataHome();
    }, []);
    const DataFormater = (number) => {
        if(number >= 1000000000){
          return (numberWithCommas(Math.round(number/1000000))).toString() + ' Tr';
        } else if(number >= 1000000){
          return (numberWithCommas(Math.round(number/1000))) + ' K';
        } else return numberWithCommas(number)
      }

    return (
        <div className="featured">
            <div className="featured__item color-green">
                <div className="featured__item-content">
                    <span className="featured__item-content-title">
                        Doanh thu
                    </span>
                    <span className="featured__item-content-money">
                        {totalSales ? totalSales?.revenue?.toLocaleString() : 0} VNĐ
                    </span>
                </div>
                <div className="featured__item-icon">
                    <FaFileInvoiceDollar />
                </div>
            </div>

            <div className="featured__item color-blue">
                <div className="featured__item-content">
                    <span className="featured__item-content-title">
                        Đơn hàng
                    </span>
                    <span className="featured__item-content-money">
                        {totalSales ? totalSales.purchase : '0'}
                    </span>
                </div>
                <div className="featured__item-icon">
                    <AiOutlineFileProtect />
                </div>
            </div>

            <div className="featured__item color-total">
                <div className="featured__item-content">
                    <span className="featured__item-content-title">
                        Sản phẩm đang bán
                    </span>
                    <span className="featured__item-content-money">{totalSales ? totalSales.product : 0}</span>
                </div>
                <div className="featured__item-icon">
                    <RiLuggageCartLine />
                </div>
            </div>
            <div className="featured__item color-total">
                <div className="featured__item-content">
                    <span className="featured__item-content-title">
                        Khách hàng
                    </span>
                    <span className="featured__item-content-money">{totalSales ? totalSales.user : 0}</span>
                </div>
                <div className="featured__item-icon">
                    <RiUserAddFill />
                </div>
            </div>

        </div>
    )
}

export default FeaturedInfo
