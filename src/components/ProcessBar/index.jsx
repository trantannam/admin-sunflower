
const ProcessBar = ({ bgcolor = '#99ccff', process = '0', height = '30' }) => {
    const Parentdiv = {
        height,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
        margin: '20px 0'
    }

    const Childdiv = {
        height: '100%',
        width: `${process}%`,
        backgroundColor: bgcolor,
        borderRadius: 40,
        textAlign: 'right'
    }

    const Processtext = {
        fontSize: 16,
        padding: 10,
        color: 'black',
        fontWeight: 900
    }

    return (
        <div style={Parentdiv}>
            <div style={Childdiv}>
                <span style={Processtext}>
                    {`${process}%`}
                </span>
            </div>
        </div>
    )
}

export default ProcessBar;
