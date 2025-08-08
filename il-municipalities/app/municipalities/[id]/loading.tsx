export default function Loading() {
  return (
    <div className="p-6 max-w-6xl mx-auto animate-pulse space-y-4">
      <div className="h-8 w-1/2 bg-gray-200 rounded" />
      <div className="h-5 w-1/3 bg-gray-200 rounded" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="h-16 bg-gray-200 rounded" />
        <div className="h-16 bg-gray-200 rounded" />
        <div className="h-16 bg-gray-200 rounded" />
        <div className="h-16 bg-gray-200 rounded" />
      </div>
      <div className="h-9 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-200 rounded" />
      </div>
      <div className="h-72 bg-gray-200 rounded" />
    </div>
  );
}