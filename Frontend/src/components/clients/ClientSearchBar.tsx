import { textInputClass } from '../../styles/formControls';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ClientSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full sm:w-72">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        placeholder="Search clients by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${textInputClass} pl-9`}
      />
    </div>
  );
}
