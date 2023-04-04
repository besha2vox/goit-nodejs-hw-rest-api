const createMessage = (error, method) => {
    const errorTypes = error.details.map(({ type }) => type);
    const isEmailInvalid = errorTypes.some((type) => type === 'string.email');
    const isMissingFields = errorTypes.some((type) => type === 'any.required');
    const isStringBaseError = errorTypes.some((type) => type === 'string.base');
    const missingFields = error.details.reduce((acc, { type, context }) => {
        if (type === 'any.required') {
            acc.push(context.key);
        }
        return acc;
    }, []);

    if (isMissingFields) {
        switch (method) {
            case 'post':
                return missingFields.length > 1
                    ? `missing required fields: ${missingFields.join(', ')}`
                    : `missing required ${missingFields[0]} field`;

            case 'put':
                return 'missing fields';

            default:
                break;
        }
    }

    if (isEmailInvalid) return 'email is invalid';

    if (isStringBaseError) {
        const { message } = error.details.find(
            ({ type }) => type === 'string.base'
        );
        return message;
    }
};

module.exports = createMessage;
