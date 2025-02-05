import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { format, parseISO } from 'date-fns';
import { BundleEntry, MedicationStatement } from 'fhir/r2';
import { ClinicalDocument } from '../../models/clinical-document/ClinicalDocument.type';
import { CardBase } from '../connection/CardBase';
import { TimelineCardSubtitile } from '../timeline/TimelineCardSubtitile';

export function MedicationsListCard({
  items,
}: {
  items: ClinicalDocument<BundleEntry<MedicationStatement>>[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="col-span-6 sm:col-span-3 ">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full font-bold">
              <div className="flex w-full items-center justify-between py-6 text-xl font-extrabold">
                Medications
                <ChevronDownIcon
                  className={`h-8 w-8 rounded duration-150 active:scale-95 active:bg-slate-50 ${
                    open ? 'rotate-180 transform ' : ''
                  }`}
                />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel>
              <CardBase>
                <div className="min-w-0 flex-1">
                  {items.map((item) => (
                    <div className="py-2" key={item.id}>
                      <p className="text-sm font-bold text-gray-900 md:text-base">
                        {item.metadata?.display_name}
                      </p>
                      <TimelineCardSubtitile variant="dark">
                        {item.metadata?.date
                          ? format(parseISO(item.metadata.date), 'MM/dd/yyyy')
                          : ''}
                      </TimelineCardSubtitile>
                    </div>
                  ))}
                </div>
              </CardBase>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
