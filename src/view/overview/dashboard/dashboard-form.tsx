import { AdminService, Mode } from '../../../dependency/x-service-concept';
import { FormController, useFormData } from '../../../component/form';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { matchResponse } from '../../../dependency/protocol';
import { reportErrorE } from '../../../component/notify';

export interface DashboardAirState {
    is_on: boolean;
    available: boolean;
    daemon_available: boolean;
    current_degree: number;
    metrics_delay: number;
    update_delay: number;
    mode: Mode;
    work_state: string;
}

function checkDegree(deg: string) {
    if (deg === '') {
        return 'required';
    }
    if (isNaN(parseFloat(deg))) {
        return 'not a valid float number';
    }
    return;
}

function checkMode(mode: string) {
    if (mode === '') {
        return 'required';
    }
    if (mode !== 'heat' && mode !== 'cool') {
        return '\'heat\' or \'cool\' value required';
    }
    return;
}

function checkDelay(delay: string) {
    if (delay === '') {
        return 'required';
    }
    console.log(isNaN(parseInt(delay)));
    if (isNaN(parseInt(delay))) {
        return 'not a valid integer number';
    }
    return;
}

export type DashboardForControllerType = FormController<{
    current_degree: number;
    mode: Mode;
    metrics_delay: number;
    update_delay: number;
}>;

export function useDashboardFormController(airState: DashboardAirState) {
    return useFormData(
        {
            current_degree: airState.current_degree,
            mode: airState.mode,
            metrics_delay: airState.metrics_delay,
            update_delay: airState.update_delay,
        },
        {
            current_degree: checkDegree,
            mode: checkMode,
            metrics_delay: checkDelay,
            update_delay: checkDelay,
        }
    );
}

export function useOnSave(
    formController: DashboardForControllerType,
    adminService: AdminService,
    airState: DashboardAirState,
    setAirState: Dispatch<SetStateAction<DashboardAirState>>,
    setEditing: Dispatch<SetStateAction<boolean>>
) {
    return useCallback(() => {
        if (formController.state.current_degree !== airState.current_degree) {
            console.log(formController.state.current_degree, airState.current_degree);
            adminService
                .SetCurrentTemperature(formController.state.current_degree)
                .then((resp) => {
                    matchResponse(resp, () =>
                        setAirState((state) => {
                            state.current_degree = formController.state.current_degree;
                            return { ...state };
                        })
                    );
                })
                .catch(reportErrorE);
        }

        if (formController.state.mode !== airState.mode) {
            console.log(formController.state.mode, airState.mode);
            adminService
                .SetMode(formController.state.mode)
                .then((resp) => {
                    matchResponse(resp, () =>
                        setAirState((state) => {
                            state.mode = formController.state.mode;
                            return { ...state };
                        })
                    );
                })
                .catch(reportErrorE);
        }

        if (formController.state.metrics_delay !== airState.metrics_delay) {
            console.log(formController.state.metrics_delay, airState.metrics_delay);
            adminService
                .SetMetricsDelay(formController.state.metrics_delay)
                .then((resp) => {
                    matchResponse(resp, () =>
                        setAirState((state) => {
                            state.metrics_delay = formController.state.metrics_delay;
                            return { ...state };
                        })
                    );
                })
                .catch(reportErrorE);
        }

        if (formController.state.update_delay !== airState.update_delay) {
            console.log(formController.state.update_delay, airState.update_delay);
            adminService
                .SetUpdateDelay(formController.state.update_delay)
                .then((resp) => {
                    matchResponse(resp, () =>
                        setAirState((state) => {
                            state.update_delay = formController.state.update_delay;
                            return { ...state };
                        })
                    );
                })
                .catch(reportErrorE);
        }
        setEditing(false);
    }, [formController, airState]);
}
