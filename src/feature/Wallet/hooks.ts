import React, { useState, useEffect } from 'react';

const regex = /\d*\.?\d\d/g;

export const useTransientState = (initialValue: string) => {
    const [textValue, setTextValue] = useState(initialValue);
    const [transientValue, setTransientValue] = useState(initialValue);
    const [isFocused, setFocused] = useState(false);
    
    useEffect(() => {
        const matches = transientValue.match(regex);
        const value = matches ? matches[0] : initialValue;
        setTextValue(value);
    }, [transientValue, initialValue]);

    return {
        textValue,
        setTextValue,
        isFocused,
        inputProps: {
            onFocus: () => {
                setTransientValue(textValue);
                setFocused(true);
            },
            onBlur: () => {
                setFocused(false);
            },
            onChange: ({ target }: React.ChangeEvent<HTMLInputElement>) => {
                setTransientValue(target.value);
            },
            value: isFocused ? transientValue : textValue
        },
    };
};
