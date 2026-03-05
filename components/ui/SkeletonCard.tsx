export default function SkeletonCard() {
  return (
    <div className="p-6 bg-white border rounded-2xl animate-pulse">
      <div className="w-32 h-4 mb-4 bg-gray-200 rounded"></div>
      <div className="w-full h-3 mb-2 bg-gray-200 rounded"></div>
      <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
    </div>
  );
}
