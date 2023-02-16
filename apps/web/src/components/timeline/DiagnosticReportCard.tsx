import { format, parseISO } from 'date-fns';
import { BundleEntry, DiagnosticReport, Observation } from 'fhir/r2';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ClinicalDocument } from '../../models/clinical-document/ClinicalDocument.type';
import {
  isOutOfRangeResult,
  ShowDiagnosticReportResultsExpandable,
} from './ShowDiagnosticReportResultsExpandable';
import { useConnectionDoc } from '../hooks/useConnectionDoc';
import { TimelineCardBase } from './TimelineCardBase';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { RxDocument } from 'rxdb';
import { useRxDb } from '../providers/RxDbProvider';
import { useUser } from '../providers/UserProvider';
import { SkeletonLoadingText } from './SkeletonLoadingText';
import { TimelineCardTitle } from './TimelineCardTitle';
import { TimelineCardCategoryTitle } from './TimelineCardCategoryTitle';

function useRelatedDocuments({
  expanded,
  isVisible,
  item,
}: {
  expanded: boolean;
  isVisible: boolean;
  item: ClinicalDocument<BundleEntry<DiagnosticReport>>;
}): [RxDocument<ClinicalDocument<BundleEntry<Observation>>>[], boolean] {
  const db = useRxDb(),
    user = useUser(),
    [docs, setDocs] = useState<
      RxDocument<ClinicalDocument<BundleEntry<Observation>>>[]
    >([]),
    listToQuery = useMemo(() => {
      return [
        ...new Set(
          item.data_record.raw.resource?.result?.map(
            (item) => `${item.reference}`
          )
        ),
      ] as string[];
    }, [item.data_record.raw.resource?.result]);
  const [isAbnormalResult, setIsAbnormalResult] = useState(false);

  useEffect(() => {
    if ((isVisible && docs.length === 0) || (expanded && docs.length === 0)) {
      db.clinical_documents
        .find({
          selector: {
            user_id: user.id,
            'metadata.id': { $in: listToQuery },
          },
        })
        .exec()
        .then((res) => {
          const sorted = res.sort((a, b) =>
            (a.metadata?.loinc_coding?.[0] || '') <
            (b.metadata?.loinc_coding?.[0] || '')
              ? 1
              : -1
          );
          setDocs(
            sorted as unknown as RxDocument<
              ClinicalDocument<BundleEntry<Observation>>
            >[]
          );
          const abnormalLabs = (
            sorted as unknown as RxDocument<
              ClinicalDocument<BundleEntry<Observation>>
            >[]
          ).filter((i) => isOutOfRangeResult(i));
          if (abnormalLabs.length > 0) {
            setIsAbnormalResult(true);
          }
        });
    }
  }, [
    db.clinical_documents,
    docs.length,
    expanded,
    isVisible,
    item.metadata?.display_name,
    listToQuery,
    user.id,
  ]);

  return [docs, isAbnormalResult];
}

function DiagnosticReportCardUnmemo({
  item,
}: {
  item: ClinicalDocument<BundleEntry<DiagnosticReport>>;
}) {
  const conn = useConnectionDoc(item.connection_record_id),
    [expanded, setExpanded] = useState(false),
    ref = useRef<HTMLDivElement | null>(null),
    entry = useIntersectionObserver(ref, {}),
    isVisible = !!entry?.isIntersecting,
    [docs, isAbnormalResult] = useRelatedDocuments({
      expanded,
      isVisible,
      item,
    });

  return (
    <>
      <TimelineCardBase onClick={() => setExpanded((x) => !x)} tabIndex={0}>
        <div className={'min-w-0 flex-1'} ref={ref}>
          <div className="items-top flex justify-between">
            <TimelineCardCategoryTitle
              title={
                <>
                  Labs
                  {isAbnormalResult && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="ml-1 inline h-4 w-4 text-red-500 sm:ml-2 sm:h-4 sm:w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  )}
                </>
              }
              color="blue"
            />
            <div className="relative py-2 pr-1">
              <div className="relative flex justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="-mt-2 -mr-2 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
            </div>
          </div>
          <TimelineCardTitle>
            {item.metadata?.display_name
              ?.replace(/- final result/gi, '')
              .replace(/- final/gi, '')}
          </TimelineCardTitle>
          <p className="truncate text-xs font-medium text-gray-500 md:text-sm">
            {item.metadata?.date
              ? format(parseISO(item.metadata.date), 'p')
              : ''}
          </p>
          {conn?.get('name') ? (
            <p className="truncate text-xs font-medium text-gray-400 md:text-sm">
              {conn?.get('name')}
            </p>
          ) : (
            <SkeletonLoadingText />
          )}
        </div>
      </TimelineCardBase>
      <ShowDiagnosticReportResultsExpandable
        docs={docs}
        item={item}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </>
  );
}

export const DiagnosticReportCard = memo(DiagnosticReportCardUnmemo);
