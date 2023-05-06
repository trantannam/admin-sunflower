import { AiOutlineLoading } from 'react-icons/ai';
import {
    CartesianGrid,
    Line,
    LineChart, ResponsiveContainer, Tooltip,
    XAxis,
    YAxis
} from 'recharts';

export default function Chart({
    title,
    data,
    label,
    dataKey,
    loading,
    width = 730,
    height = 250
}) {
    const DataFormater = (number) => {
        if(number >= 1000000000){
          return (number/1000000000).toString() + 'Tỉ';
        }else if(number >= 1000000){
          return (number/1000000).toString() + 'Tr';
        }else if(number >= 1000){
          return (number/1000).toString() + 'K';
        }else{
          return number.toString();
        }
      }
    return (
        <div className="chart">
            <h3 className="chart__title">{title}</h3>
            { loading ?
                <div className="text-xl h-full ">
                    <i className="fas fa-spinner fa-spin"></i>
                    <div className="spin">
                        <AiOutlineLoading />
                    </div>
                    Loading...
                </div> :
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart width={width} height={height} data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        padding={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                        <XAxis dataKey={label} />
                        <YAxis tickFormatter={DataFormater} />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                        <Tooltip />
                        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            }
        </div>
    );
}
