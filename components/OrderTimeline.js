const STEPS = ['pending', 'accepted'];

export default function OrderTimeline({ status }) {
  if (status === 'rejected' || status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-green-600 px-2 py-0.5 text-white">Placed</span>
        <span className="h-px w-6 bg-gray-300" />
        <span className={`rounded-full px-2 py-0.5 text-white ${status === 'rejected' ? 'bg-red-600' : 'bg-gray-500'}`}>
          {status === 'rejected' ? 'Rejected' : 'Cancelled'}
        </span>
      </div>
    );
  }
  const idx = STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="rounded-full bg-green-600 px-2 py-0.5 text-white">Placed</span>
      <span className="h-px w-6 bg-gray-300" />
      <span className={`rounded-full px-2 py-0.5 ${idx >= 0 ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>Pending</span>
      <span className="h-px w-6 bg-gray-300" />
      <span className={`rounded-full px-2 py-0.5 ${idx >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Accepted</span>
    </div>
  );
}