import { useState, useEffect } from 'react';
import useVlaidation from './useValidation';

const useForm = (callback, schema, intialValues = {}) => {

    const [id, setId] = useState();
    const [values, setValues] = useState(intialValues);
    const [errors, setErrors] = useState({});
    const { validateInput, validateForm } = useVlaidation(schema)
    useEffect(() => {
        //set id
        setId(intialValues.id)
        //delete id to set values without id to can differentiate between edit and add
        // because if you but id with values at the first edit the property id will added
        //and you can't remove it if you need to add new item 
        //beecause you clone previous values ...values 
        let initValue = { ...intialValues }
        delete initValue.id;
        setValues(initValue)
    }, [intialValues])

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        let formErrors = validateForm(values)
        setErrors(() => (formErrors))
        if (Object.keys(formErrors).length === 0) {
            callback({ id, ...values })
        }
    };

    const handleChange = ({ target: input }) => {
        let { name, value } = input;
        let error = validateInput(name, value);
        setErrors(errors => ({ ...errors, [name]: error }));
        setValues(values => ({ ...values, [name]: value }));
    };

    return {
        handleChange,
        handleSubmit,
        values,
        errors,
    }
};

export default useForm;