export default function handleExpressValidatorErrors(errors: {
    type: string,
    value: string,
    msg: string,
    path: string,
    location: string
}[]) {
    let parsed: Record<string, string> = {};
    for (const error of errors)
        parsed[error.path] = error.msg;
    return parsed;
}