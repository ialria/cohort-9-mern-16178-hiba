function Toast({ message }) {
  return (
    <div className="fixed top-5 right-5 z-50 bg-surface border border-primary-light rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
        <span className="text-surface text-sm font-bold">✓</span>
      </div>

      <p className="text-text text-sm">{message}</p>
    </div>
  );
}

export default Toast