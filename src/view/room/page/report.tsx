import { DependencyContainer } from '../../../lib/common';
import { RouteComponentProps } from 'react-router-dom';
import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import { context } from '../../../context';
import { SlaveStatistics } from '../../../dependency/x-service-concept';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: 1.5715,
        },
    })
);

export function RoomReport({ adminService }: DependencyContainer) {
    return (props: RouteComponentProps) => {
        const { I18nContext: i18n } = context;
        const classes = useStyles();
        const queryHandler = useCallback((query) => {
            return new Promise((resolve) =>
                resolve({
                    data: [{ room_id: 1 }],
                    page: 0,
                    totalCount: 1,
                })
            );
            // return adminService
            //     .GetSlaveStatistics(roomID, new Date(Date.now() - 2000000), new Date(Date.now()))
            //     .then((resp) => {
            //         const data = unwrap(resp);
            //         setExportData(data);
            //         return {
            //             data: data,
            //             page: 0,
            //             totalCount: data.length
            //         };
            //     });
        }, []);

        const [exportData] = useState<SlaveStatistics[] | undefined>(undefined);

        const onExport = useCallback(() => {
            if (!exportData) {
                return;
            }
            console.log(exportData);
            const file = new Blob([JSON.stringify(exportData)]),
                filename = 'report_' + '.json';
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(file, filename);
            } else {
                const a = document.createElement('a'),
                    url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }, [exportData]);

        return (
            <React.Fragment>
                <div className={classes.title}>
                    从控报表
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onExport}
                        type="button"
                        style={{
                            marginRight: '1em',
                            float: 'right',
                        }}
                    >
                        Export
                    </Button>
                </div>
                <MaterialTable
                    localization={i18n.statics.global.material_table_localization}
                    title={''}
                    columns={[{ title: 'id', field: 'room_id' }]}
                    data={queryHandler}
                    options={{
                        sorting: true,
                        actionsColumnIndex: -1,
                        toolbar: false,
                        paging: false,
                    }}
                />
            </React.Fragment>
        );
    };
}
