import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import CustomPaginationActionsTable from './Table';

export default class AppointmentSummary extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { appointmentsToView, appointmentsToViewHeaders, ...others } = this.props;
        const date = appointmentsToView['date']
        const appointments = appointmentsToView['appointments'] || []

        return (
            <Dialog {...others}>
                <DialogTitle >Appointmetns at {date}</DialogTitle>
                <CustomPaginationActionsTable headers={appointmentsToViewHeaders} rows={appointments} />
            </Dialog>
        );
    }
}
