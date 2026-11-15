interface SkeletonProps {
  cantidad?: number;
}

export function Skeleton({ cantidad = 4 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: cantidad }).map((_, indice) => (
        <div key={indice} className="h-48 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
