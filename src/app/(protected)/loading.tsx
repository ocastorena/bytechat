export default function Loading() {
  return (
    <div className="flex justify-center mt-4 px-4">
      <div className="w-full max-w-xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-1 py-4 border-b border-border/50">
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="flex gap-2">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
