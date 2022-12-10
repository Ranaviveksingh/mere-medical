import { format, parseISO } from 'date-fns';
import { BundleEntry, Condition } from 'fhir/r2';
import { ClinicalDocument } from '../models/ClinicalDocument';

export function ConditionsListCard({
  items,
}: {
  items: ClinicalDocument<BundleEntry<Condition>>[];
}) {
  if (items.length === 0) return null;
  return (
    <>
      <div className="py-6 text-xl font-extrabold">Conditions</div>
      <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 ">
        <div className="min-w-0 flex-1">
          <span className="absolute inset-0" aria-hidden="true" />
          {items.map((item) => (
            <div className="py-2" key={item._id}>
              <p className="text-md font-bold text-gray-900">
                {item.metadata?.display_name}
              </p>
              <p className="truncate text-sm font-medium text-gray-500">
                {item.metadata?.date
                  ? format(parseISO(item.metadata.date), 'MM/dd/yyyy')
                  : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
