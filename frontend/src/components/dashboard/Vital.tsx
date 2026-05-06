const Vital = ({ label, value, wide = false }: { label: string; value: string | number; wide?: boolean }) => {
  return (
    <div className={`${wide ? 'col-span-2' : ''} min-w-0 rounded bg-white/85 px-1 py-0.5 ring-1 ring-primary-light/70`}>
      <div className="whitespace-nowrap font-black leading-3 text-primary-dark">{value}</div>
      <div className="font-bold leading-3 text-primary-dark/45">{label}</div>
    </div>
  );
};
export default Vital;