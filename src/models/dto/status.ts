import { useTranslation } from 'react-i18next';
export interface Status {
    id?: number;
    name: string;
    color?: string;
}
export interface StatusMap {
    [key: number]: Status
}


export function GetStatusMap() {
    const { t } = useTranslation();
    const statusMap: StatusMap = {
        0: { name: t('status.all'), color: 'black' },
        1: { name: t('status.approved'), color: 'green' },
        2: { name: t('status.needSurvey'), color: 'goldenrod' },
        3: { name: t('status.needApprove'), color: 'goldenrod' },
        4: { name: t('status.waitingUpdate'), color: 'goldenrod' },
        5: { name: t('status.deleted'), color: 'red' },
        6: { name: t('status.rejected'), color: 'red' },
    }
    const statusFilter: Status[] = [
        { id: 1, name: t('status.approved') },
        { id: 2, name: t('status.needSurvey') },
        { id: 3, name: t('status.needApprove') },
        { id: 4, name: t('status.waitingUpdate') },
        { id: 5, name: t('status.deleted') },
        { id: 6, name: t('status.rejected') }
    ]
    return { statusMap, statusFilter };
}
