export interface FormFieldStateInput {
    isDisabled?: boolean;
    isReadOnly?: boolean;
}

export function resolveFormFieldState(
    props: FormFieldStateInput,
    fieldDisabled?: boolean,
) {
    const isDisabled = props.isDisabled ?? fieldDisabled ?? false;
    const isReadOnly = props.isReadOnly ?? false;
    const isInactive = isDisabled || isReadOnly;

    return { isDisabled, isReadOnly, isInactive };
}
