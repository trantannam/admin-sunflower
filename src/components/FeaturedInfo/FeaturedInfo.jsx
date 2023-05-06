import axios from 'axios';
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
            const sales = await axios.get("/api/dashboard/summary");
            const dataSales = sales.data.data || [];
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
                    <span className="featured__item-content-money">
                        {totalSales ? DataFormater(totalSales?.total_revenue) : 0} VNĐ
                    </span>
                    <span className="featured__item-content-title">
                        Doanh thu
                    </span>
                </div>
                <div className="featured__item-icon">
                    <FaFileInvoiceDollar />
                </div>
            </div>

            <div className="featured__item color-blue">
                <div className="featured__item-content">
                    <span className="featured__item-content-money">
                        {totalSales ? totalSales.total_invoice : '0'}
                    </span>
                    <span className="featured__item-content-title">
                        Đơn hàng
                    </span>
                </div>
                <div className="featured__item-icon">
                    <AiOutlineFileProtect />
                </div>
            </div>

            <div className="featured__item color-total">
                <div className="featured__item-content">
                    <span className="featured__item-content-money">{totalSales ? totalSales.total_sell : 0}</span>
                    <span className="featured__item-content-title">
                        Sản phẩm đang bán
                    </span>
                </div>
                <div className="featured__item-icon">
                    <RiLuggageCartLine />
                </div>
            </div>
            <div className="featured__item color-total">
                <div className="featured__item-content">
                    <span className="featured__item-content-money">{totalSales ? totalSales.total_user : 0}</span>
                    <span className="featured__item-content-title">
                        Khách hàng
                    </span>
                </div>
                <div className="featured__item-icon">
                    <RiUserAddFill />
                </div>
            </div>

        </div>
    )
}

export default FeaturedInfo
