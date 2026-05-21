interface FormFieldErrorProps {
  errors?: unknown[];
  touched?: boolean;
}

export function FormFieldError({
  errors,
  touched,
}: FormFieldErrorProps) {
  if (!touched || !errors || errors.length === 0) {
    return null;
  }

  const error = errors[0];

  return (
    <p className="text-sm text-destructive">
      {typeof error === "string"
        ? error
        : (error as { message?: string })?.message}
    </p>
  );
}