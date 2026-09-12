interface VitalProps {
  label: string;
  value: string | number;
  wide?: boolean;
  points?: number;
}

const Vital = ({ label, value, wide = false, points = 0 }: VitalProps) => {
  const getHighlightStyle = (pts: number) => {
    if (pts >= 3) return 'bg-red-100 text-red-900 ring-1 ring-red-400 font-extrabold';
    if (pts === 2) return 'bg-orange-100 text-orange-900 ring-1 ring-orange-400 font-bold';
    if (pts === 1) return 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 font-bold';
    return 'bg-white/85 text-primary-dark ring-1 ring-primary-light/70';
  };

  return (
    <div className={`${wide ? 'col-span-2' : ''} min-w-0 rounded px-1 py-0.5 ${getHighlightStyle(points)}`}>
      <div className="whitespace-nowrap font-black leading-3">{value}</div>
      <div className="font-bold leading-3 opacity-75">{label}</div>
    </div>
  );
};

export default Vital;
