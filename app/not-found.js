import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-5 py-16 text-center">
      <div>
        <FontAwesomeIcon icon={faMugHot} className="text-4xl text-brew" />
        <h1 className="mt-4 font-display text-3xl font-bold text-bean">Page not found</h1>
        <p className="mt-2 text-brew">
          That farm or page isn&apos;t in the registry.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Back to the map
        </Link>
      </div>
    </div>
  );
}
