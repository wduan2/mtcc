import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import * as adminActions from '../data/adminActions';
import CustomPaginationActionsTable from './Table';


const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

class AdminSchedule extends React.Component {
    constructor(props) {
        super(props);

        this.handleSetScheduleSubmit = this.handleSetScheduleSubmit.bind(this)
        this.handleOptionSelected = this.handleOptionSelected.bind(this)
    }

    state = {
        setStaffId: '',
        setDay: '',
        setStart: '10:00',
        setEnd: '20:00',
        schedules: [],
        staffList: [],
        submitEnabled: true
    }

    resetState() {
        this.setState({
            setStaffId: '',
            setDay: '',
            setStart: '10:00',
            setEnd: '20:00'
        })
    }

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']

    tableHeaders = ['Staff Id', 'Staff Name', ...this.days]

    componentDidMount() {
        this.updateSchedules()
    }

    setSubmitEnabledTo(value = false) {
        this.setState({
            submitEnabled: value
        })
    }

    updateSchedules() {
        adminActions.getStaffs().then((querySnapshot) => {
            const staffList = []
            const schedules = {}
            querySnapshot.forEach((doc) => {
                const staff = doc.data()
                staffList.push(staff)

                // make sure the order of assigning match the order of headers

                schedules[staff.id] = { id: staff.id, staffName: staff.name }
                this.days.forEach((day) => schedules[staff.id][day] = '')
            })

            adminActions.getSchedules().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const schedule = doc.data()
                    schedules[schedule.staffId][schedule.day] = `${schedule.start} - ${schedule.end}`
                })

                this.setState({
                    staffList: staffList,
                    schedules: schedules
                })
            }).catch((e) => {
                console.error(e)
            })
        })
    }

    handleOptionSelected(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSetScheduleSubmit(evt) {
        this.setSubmitEnabledTo(false)

        const { setStaffId, setDay, setStart, setEnd } = this.state

        adminActions.setSchedule(setStaffId, setDay, setStart, setEnd)
            .then(() => {
                this.updateSchedules()
                this.setSubmitEnabledTo(true)
                this.resetState()
            })
            .catch((e) => {
                console.error(e)
                this.setSubmitEnabledTo(true)
            })
    }

    render() {
        const { classes } = this.props
        const { setStaffId, setDay, setStart, setEnd, submitEnabled, staffList, schedules } = this.state

        return (
            <div className={classes.container}>
                <Grid container spacing={16}>
                    <Grid item xs={2}>
                        <h3>Set Schedule</h3>
                        <form className={classes.container} noValidate>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="set-staff">Staff</InputLabel>
                                <Select
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{
                                        name: 'setStaffId',
                                        id: 'set-staff',
                                    }}
                                    value={setStaffId}
                                    onChange={this.handleOptionSelected}
                                >
                                    {staffList.map((staff) => <MenuItem key={staff.id} value={staff.id}>{staff.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="set-day">Day</InputLabel>
                                <Select
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{
                                        name: 'setDay',
                                        id: 'set-day',
                                    }}
                                    value={setDay}
                                    onChange={this.handleOptionSelected}
                                >
                                    {this.days.map((day) => <MenuItem key={day} value={day}>{day}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField
                                name='setStart'
                                label='Start Time'
                                type='time'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 1800, // 30 min
                                }}
                                required={true}
                                value={setStart}
                                onChange={(this.handleOptionSelected)}
                            />
                            <TextField
                                name='setEnd'
                                label='End Time'
                                type='time'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 1800, // 30 min
                                }}
                                required={true}
                                value={setEnd}
                                onChange={(this.handleOptionSelected)}
                            />
                            <Button
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                disabled={!submitEnabled || !setStaffId || !setDay || !setStart || !setEnd}
                                onClick={this.handleSetScheduleSubmit}
                            >
                                Set
                            </Button>
                        </form>
                    </Grid>

                    <Grid item xs={10}>
                        <CustomPaginationActionsTable headers={this.tableHeaders} rows={Object.values(schedules)} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(AdminSchedule);
