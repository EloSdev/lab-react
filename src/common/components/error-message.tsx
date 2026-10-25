interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p role="alert" className="text-red-700">
      {message}
    </p>
  );
}
