import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

RadioField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    defaultChecked: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
};

RadioField.defaultProps = {
    title: "",
    label: "",
    className: "",
};

function RadioField(props) {
    const {
        id,
        title,
        name,
        className,
        defaultChecked,
        onChange
    } = props;
    const [state, setState] = useState(defaultChecked ? defaultChecked : false)
    useEffect(() => {
        const val = defaultChecked ? defaultChecked : false
        setState(val)
    }, [defaultChecked])
    
    function handleChange(event) {
        onChange(event)
        setState(event.target.value);
    }

    return (
        <div className="flex items-center w-fit mr-2">
            <input
                id={id}
                name={name}
                type='radio'
                className={className}
                checked={state}
                onChange={(e)=>handleChange(e)}
            />
            <label htmlFor={id}>{title}</label>
        </div>
    );
}

export default RadioField;