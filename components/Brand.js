import Image from 'next/image';
import Link from 'next/link';

/** Official seal of the Province of Agusan del Norte. */
export function Seal({ size = 40, className = '', priority = false }) {
  return (
    <Image
      src="/adn-seal.png"
      alt="Official Seal of the Province of Agusan del Norte"
      width={size}
      height={size}
      priority={priority}
      className={className}
    />
  );
}

/** Coffee bean — used as a motif, bullet and divider ornament. */
export function CoffeeBean({ className = '', size = 16, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 32"
      width={size}
      height={(size * 32) / 24}
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <ellipse cx="12" cy="16" rx="11" ry="15" fill="currentColor" />
      <path
        d="M12 3.5c3.2 4.6 3.2 20.4 0 25"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Three beans with hairlines — a section divider. */
export function BeanDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <CoffeeBean size={11} className="rotate-[-18deg] text-crema" />
      <CoffeeBean size={13} className="text-brew" />
      <CoffeeBean size={11} className="rotate-[18deg] text-crema" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** Header lockup: seal + wordmark. */
export function Wordmark({ onDark = false }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <Seal size={42} priority className="shrink-0" />
      <span className="leading-none">
        <span
          className={`block font-display text-[19px] font-bold tracking-tight ${
            onDark ? 'text-milk' : 'text-bean'
          }`}
        >
          ADN Kape
        </span>
        <span
          className={`mt-1 block text-[9.5px] font-semibold uppercase tracking-official ${
            onDark ? 'text-crema' : 'text-brew'
          }`}
        >
          Agusan del Norte
        </span>
      </span>
    </Link>
  );
}
