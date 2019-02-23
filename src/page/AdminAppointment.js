import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import React from 'react';
import * as adminActions from '../data/adminActions';
import * as calculateAvailability from '../data/calculateAvailability'

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

class AdminAppointment extends React.Component {
    constructor(props) {
        super(props);

        this.handleAvailabilityOptionSelected = this.handleAvailabilityOptionSelected.bind(this)
        this.handleServiceGroupSelected = this.handleServiceGroupSelected.bind(this)
        this.handleOptionSelected = this.handleOptionSelected.bind(this)
        this.handleSetAppointmentSubmit = this.handleSetAppointmentSubmit.bind(this)
    }

    state = {
        setCustomerName: '',
        setCustomerEmail: '',
        setCustomerPhone: '',
        setServiceGroup: '',
        setServiceId: '',
        setStaffId: '',
        setDate: moment().format('YYYY-MM-DD'),
        setTime: '',
        availabilities: [],
        services: [],
        staffList: [],
        allServices: [],
        schedules: {},
        appointments: {},
        submitEnabled: true
    }

    reset() {
        this.setState({
            setCustomerName: '',
            setCustomerEmail: '',
            setCustomerPhone: '',
            setServiceGroup: '',
            setServiceId: '',
            setStaffId: '',
            setDate: moment().format('YYYY-MM-DD'),
            setTime: '',
            availabilities: [],
            services: []
        })
    }

    setSubmitEnabledTo(value = false) {
        this.setState({
            submitEnabled: value
        })
    }

    componentDidMount() {
        this.updateStoreInfo()
        this.updateAppointmentList()
    }

    updateAppointmentList() {
        adminActions.getAppointments().then((querySnapshot) => {
            const appointments = {}
            querySnapshot.forEach((doc) => {
                const appointment = doc.data()
                appointments[appointment.date] = appointments[appointment.date] || []
                appointments[appointment.date].push(appointment)
            })
            this.setState({
                appointments: appointments
            })
        }).catch((e) => {
            console.error(e)
        })
    }

    updateStoreInfo() {
        adminActions.getStaffs().then((querySnapshot) => {
            const staffList = querySnapshot.docs.map((doc) => doc.data())
            staffList.push({ 'viewId': 'fakeId', 'staffId': '', 'staffName': 'Anyone' })
            this.setState({
                staffList: staffList
            })
        }).catch((e) => {
            console.error(e)
        })

        adminActions.getSchedules().then((querySnapshot) => {
            const schedules = {}
            // group schedules by day of week
            querySnapshot.forEach((doc) => {
                const schedule = doc.data()
                schedules[schedule.day] = schedules[schedule.day] || []
                schedules[schedule.day].push(schedule)
            })
            this.setState({
                schedules: schedules
            })
        }).catch((e) => {
            console.error(e)
        })

        adminActions.getServices().then((querySnapshot) => {
            const allServices = {}
            querySnapshot.forEach((doc) => {
                const service = doc.data()
                allServices[service.group] = allServices[service.group] || []
                allServices[service.group].push(service)
            })
            this.setState({
                allServices: allServices
            })
        }).catch((e) => {
            console.error(e)
        })
    }

    handleServiceGroupSelected(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        }, () => {
            const { allServices, setServiceGroup } = this.state
            this.setState({
                services: allServices[setServiceGroup]
            })
        })
    }

    handleAvailabilityOptionSelected(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        }, () => {
            const { setServiceGroup, setServiceId, setStaffId, setDate, schedules, appointments, staffList, allServices } = this.state

            const serviceDuration = allServices[setServiceGroup].find((s) => s.id === setServiceId)

            if (setDate) {
                const availabilities = calculateAvailability.calculate(schedules, appointments, staffList, setStaffId, serviceDuration, setDate)
                this.setState({
                    availabilities: availabilities
                })
            }
        })
    }

    handleOptionSelected(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSetAppointmentSubmit() {

    }

    render() {
        const { classes } = this.props
        const { setCustomerName, setCustomerEmail, setCustomerPhone, setServiceGroup, setServiceId, setStaffId, setDate, setTime, staffList, services, allServices, availabilities, appointments, submitEnabled } = this.state

        return (
            <div className={classes.container}>
                <Grid container spacing={16}>
                    <Grid item xs={2}>
                        <h3>Set Appointment</h3>
                        <form className={classes.container} noValidate>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor='set-service-group'>Category</InputLabel>
                                <Select
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{
                                        name: 'setServiceGroup',
                                        id: 'set-service-group',
                                    }}
                                    value={setServiceGroup}
                                    onChange={this.handleServiceGroupSelected}
                                >
                                    {Object.keys(allServices).map((group, index) => <MenuItem key={index} value={group}>{group}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor='set-service'>Service</InputLabel>
                                <Select
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{
                                        name: 'setServiceId',
                                        id: 'set-service',
                                    }}
                                    value={setServiceId}
                                    onChange={this.handleOptionSelected}
                                >
                                    {services.map((service) => <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField
                                name="setDate"
                                label="Date"
                                type="date"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={setDate}
                                onChange={(this.handleAvailabilityOptionSelected)}
                            />
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor='set-staff'>Staff</InputLabel>
                                <Select
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{
                                        name: 'setStaffId',
                                        id: 'set-staff',
                                    }}
                                    value={setStaffId}
                                    onChange={this.handleAvailabilityOptionSelected}
                                >
                                    {staffList.map((staff, index) => <MenuItem key={index} value={staff.id}>{staff.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor='set-time'>Time</InputLabel>
                                <Select
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{
                                        name: 'setTime',
                                        id: 'set-time',
                                    }}
                                    value={setTime}
                                    onChange={this.handleOptionSelected}
                                >
                                    {availabilities.map((time, index) => <MenuItem key={index} value={time}>{time}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField
                                name='setCustomerName'
                                label='Customer Name'
                                type='text'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required={true}
                                value={setCustomerName}
                                onChange={(this.handleOptionSelected)}
                            />
                            <TextField
                                name='setCustomerEmail'
                                label='Customer Email'
                                type='email'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required={true}
                                value={setCustomerEmail}
                                onChange={(this.handleOptionSelected)}
                            />
                            <TextField
                                name='setCustomerPhone'
                                label='Customer Phone number'
                                type='tel'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required={true}
                                value={setCustomerPhone}
                                onChange={(this.handleOptionSelected)}
                            />
                            <Button
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                disabled={!submitEnabled || !setServiceId || !setDate || !setTime || !setCustomerName || !setCustomerEmail || !setCustomerPhone}
                                onClick={this.handleSetAppointmentSubmit}
                            >
                                Set
                            </Button>
                        </form>
                    </Grid>

                    <Grid item xs={10}>

                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(AdminAppointment);
