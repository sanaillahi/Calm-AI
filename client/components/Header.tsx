export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-sm border-b border-soft-lavender shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4 sm:py-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <span className="text-3xl sm:text-4xl">Calm AI</span>
            
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Your Companion that will hear you and support you
          </p>
        </div>
      </div>
    </header>
  );
}
