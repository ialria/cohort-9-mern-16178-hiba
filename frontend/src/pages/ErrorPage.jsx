function ErrorPage({
  title = "Oops! Something went wrong",
  message = "Sorry we couldn't complete your request. Please try again.",
  onRetry,
}) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-delete-bgLight flex items-center justify-center mb-6">
          <span className="text-error text-2xl font-semibold">!</span>
        </div>

        <h1 className="text-2xl font-semibold text-text">
          {title}
        </h1>

        <p className="mt-3 text-sm text-text-muted">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-background cursor-pointer"
          >
            Try Again
          </button>
        )}
      </div>
    </main>
  );
}

export default ErrorPage;