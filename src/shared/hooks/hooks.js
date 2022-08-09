import { useState, useCallback } from 'react';

export const useTextField = initialValue => {
    const [value, setValue] = useState(initialValue);

    const reset = useCallback( () => setValue(initialValue))

    return [
        { value, onChange: e => setValue(e.target.value) },
        reset
    ];
}

export const useTextFieldWithErrorHandling = (initialValue ) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(false)
    const [helperText, setHelperText] = useState('')

    function onChangeHandler(e) {
        setValue(e.target.value) 
        if (error) {
            setError(false)
            setHelperText('')
            setValue(e.target.value) 
        }
    }
    
    return [
        { value, error, helperText, onChange: onChangeHandler},
        () => setValue(initialValue), setError, setHelperText
    ];
}