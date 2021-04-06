import Joi from "joi";
const useVlaidation = (schema) => {

    //parameters : Js Input
    const validateInput = (name, value) => {
        let inputSchema = Joi.object().keys({ [name]: schema[name] });
        let { error } = inputSchema.validate({ [name]: value });
        if (error) return error.details[0].message;
        return '';
    };

    const validateForm = (data) => {
        let formSchema = Joi.object().keys(schema);
        let errors = formSchema.validate(data, { abortEarly: false });
        let error = {};
        if (errors.error) {
            errors.error.details.forEach(err => {
                let key = err.context.key;
                let message = err.message;
                error[key] = message;
            });
        }
        return error;
    };
    
    return { validateInput, validateForm }
}

export default useVlaidation;