function Loading() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
          aria-label="Loading"
        />

        <p className="text-sm text-text-muted">
          Loading...
        </p>
      </div>
    </main>
  );
}

export default Loading;
