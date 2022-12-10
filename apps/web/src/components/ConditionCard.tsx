import { format, parseISO } from 'date-fns';
import { BundleEntry, Condition } from 'fhir/r2';
import { ClinicalDocument } from '../models/ClinicalDocument';

export function ConditionCard({
  item,
}: {
  item: ClinicalDocument<BundleEntry<Condition>>;
}) {
  return (
    <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-offset-2 hover:border-gray-400 ">
      <div className="min-w-0 flex-1">
        <div className=" pb-2 font-bold text-green-600">Condition</div>
        <span className="absolute inset-0" aria-hidden="true" />
        <p className="text-md font-bold text-gray-900">
          {item.metadata?.display_name}
        </p>
        <p className="truncate text-sm font-medium text-gray-500">
          {item.metadata?.date ? format(parseISO(item.metadata.date), 'p') : ''}
        </p>
      </div>
    </div>
  );
}
