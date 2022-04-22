import React, { useCallback, useEffect } from 'react';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { useGetSubscriberDevices } from 'hooks/Network/SubscriberDevices';
import { DeviceCell } from 'models/Table';

interface Props {
  actions: (cell: DeviceCell) => React.ReactElement;
  operatorId: string;
  subscriberId: string;
  ignoredColumns?: string[];
  refreshId?: number;
  disabledIds?: string[];
  minHeight?: string;
}

const defaultProps = {
  ignoredColumns: [],
  refreshId: 0,
  disabledIds: [],
  minHeight: undefined,
};

const SubscriberDeviceTable: React.FC<Props> = ({
  actions,
  operatorId,
  subscriberId,
  ignoredColumns,
  refreshId,
  disabledIds,
  minHeight,
}) => {
  const { t } = useTranslation();
  const { data: subscriberDevices, isFetching, refetch } = useGetSubscriberDevices({ operatorId, subscriberId });

  const actionCell = useCallback((cell) => actions(cell), [actions]);
  const memoizedDate = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'created',
        Header: t('common.created'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }: { cell: DeviceCell }) => memoizedDate(cell, 'created'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'modified',
        Header: t('common.modified'),
        Footer: '',
        accessor: 'modified',
        Cell: ({ cell }: { cell: DeviceCell }) => memoizedDate(cell, 'modified'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
        disableSortBy: true,
      },
      {
        id: 'id',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }: { cell: DeviceCell }) => actionCell(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns;
  }, [disabledIds, actionCell]);

  useEffect(() => {
    if (refreshId !== undefined && refreshId > 0) refetch();
  }, [refreshId]);

  return (
    <DataTable
      columns={
        ignoredColumns ? columns.filter((col) => !ignoredColumns.find((ignored) => ignored === col.id)) : columns
      }
      data={subscriberDevices ?? []}
      isLoading={isFetching}
      obj={t('devices.title')}
      minHeight={minHeight ?? '200px'}
    />
  );
};

SubscriberDeviceTable.defaultProps = defaultProps;
export default SubscriberDeviceTable;