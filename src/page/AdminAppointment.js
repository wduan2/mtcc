import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import React from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import * as adminActions from '../data/adminActions';
import * as calculateAvailability from '../data/calculateAvailability';
import { isMobile } from './Screen';
import { PhoneNumberMask } from './TextMask';
import AppointmentSummary from './AppointmentSummary';

const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 150,
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

// not persist staff id if 'Anyone' is selected
const ANY_STAFF_ID = 'fakeId'

class AdminAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.handleOptionSelected = this.handleOptionSelected.bind(this)
        this.handleSetAppointmentSubmit = this.handleSetAppointmentSubmit.bind(this)
        this.openAppointmentsToView = this.openAppointmentsToView.bind(this)
        this.closeAppointmentsToView = this.closeAppointmentsToView.bind(this)
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
        allServices: {},
        schedules: {},
        appointments: {},
        appointmentsToView: {},
        appointmentsToViewHeaders: [],
        displayAppointmentsToView: false,
        submitEnabled: true
    }

    resetState() {
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
    }

    updateStoreInfo() {
        adminActions.getStaffs().then((querySnapshot) => {
            const staffList = []
            querySnapshot.forEach((doc) => {
                const staff = doc.data()
                if (!staff.removed) {
                    staffList.push(staff)
                }
            })

            if (staffList.length > 0) {
                // not set id for 'Anyone'
                staffList.unshift({ 'id': ANY_STAFF_ID, 'name': 'Anyone' })
            }

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
                if (!service.removed) {
                    allServices[service.group] = allServices[service.group] || []
                    allServices[service.group].push(service)
                }
            })
            this.setState({
                allServices: allServices
            })
        }).catch((e) => {
            console.error(e)
        })
    }

    handleOptionSelected(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        }, () => {
            const { setServiceGroup, setServiceId, setStaffId, setDate, schedules, allServices, services } = this.state

            // update services
            if (setServiceGroup && allServices[setServiceGroup] != services) {
                const { allServices, setServiceGroup } = this.state
                this.setState({
                    services: allServices[setServiceGroup]
                })
            }

            // update availabilities
            if (setDate && setServiceId) {
                const selectService = allServices[setServiceGroup].find((s) => s.id === setServiceId)
                // if service group changed, the previous selected service is invalid
                if (!selectService) {
                    return
                }
                const serviceDuration = selectService.duration
                const staffId = (setStaffId === ANY_STAFF_ID) ? '' : setStaffId

                adminActions.getAppointmentByDate(setDate).then((querySnapshot) => {
                    const appointments = querySnapshot.docs.map((doc) => doc.data())
                    const availabilities = calculateAvailability.calculate(schedules, appointments, staffId, serviceDuration, setDate)
                    this.setState({
                        availabilities: availabilities
                    })
                })
            }
        })
    }

    handleSetAppointmentSubmit() {
        this.setSubmitEnabledTo(false)

        const { setCustomerName, setCustomerEmail, setCustomerPhone, setDate, setTime, setServiceId, setStaffId, services } = this.state
        const start = setTime
        const duration = services.find((s) => s.id === setServiceId).duration
        const end = moment(start, 'HH:mm').add(duration, 'minutes').format('HH:mm')
        const staffId = (setStaffId === ANY_STAFF_ID) ? '' : setStaffId

        adminActions.setAppointment(setCustomerName, setCustomerEmail, setCustomerPhone, setDate, start, end, setServiceId, staffId)
            .then(() => {
                // this.updateAppointmentList()
                this.setSubmitEnabledTo(true)
                this.resetState()
            })
            .catch((e) => {
                console.error(e)
                this.setSubmitEnabledTo(true)
            })
    }

    closeAppointmentsToView() {
        this.setState({
            displayAppointmentsToView: false
        })
    }

    openAppointmentsToView(date) {
        const dateToView = moment(date).format('YYYY-MM-DD')

        const { allServices, staffList } = this.state

        adminActions.getAppointmentByDate(dateToView).then((querySnapshot) => {
            const appointments = querySnapshot.docs.map((doc) => doc.data())
            const appointmentsToView = { 'date': dateToView, 'appointments': [] }

            appointments.forEach((appointment) => {
                const toView = {}

                let selectService = undefined
                const groups = Object.keys(allServices)
                groups.forEach((group) => {
                    const services = allServices[group]
                    const service = services.find((s) => s.id === appointment.serviceId)
                    if (service) {
                        selectService = service
                        return
                    }
                })

                if (!selectService) {
                    console.error(`unable to find service info for appointment: ${appointment.id}`)
                    return
                }

                toView['id'] = appointment.id
                toView['service'] = selectService.name

                if (appointment.staffId) {
                    const staff = staffList.find((staff) => staff.id === appointment.staffId)
                    toView['staff'] = staff.name
                } else {
                    toView['staff'] = 'Anyone'
                }

                toView['start'] = appointment.start
                toView['end'] = appointment.end
                toView['customerName'] = appointment.customerName
                toView['customerEmail'] = appointment.customerEmail
                toView['customerPhone'] = appointment.customerPhone

                appointmentsToView['appointments'].push(toView)
            })
            
            const appointmentsToViewHeaders = ['Id', 'Service Name', 'Staff Name', 'Start Time', 'End Time', 'Customer Name', 'Customer Email', 'Customer Phone']

            this.setState({
                displayAppointmentsToView: true,
                appointmentsToView: appointmentsToView,
                appointmentsToViewHeaders: appointmentsToViewHeaders
            })
        })
    }

    render() {
        // TODO: reduce the time of calulating availability

        const { classes } = this.props
        const { setCustomerName, setCustomerEmail, setCustomerPhone, setServiceGroup, setServiceId, setStaffId, setDate, setTime, staffList, services, allServices, availabilities, appointments, submitEnabled } = this.state
        const today = new Date()

        return (
            <Grid container className={classes.container}>
                <Hidden smDown>
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
                                    onChange={this.handleOptionSelected}
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
                                    {services.map((service) => <MenuItem key={service.id} value={service.id}>{`${service.name} - ${service.duration} minutes - $${service.price}`}</MenuItem>)}
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
                                onChange={(this.handleOptionSelected)}
                            />
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor='set-staff'>Staff (Optional)</InputLabel>
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
                                    {availabilities.map((chunk, index) => <MenuItem key={index} value={chunk.start}>{`${chunk.start} - ${chunk.end}`}</MenuItem>)}
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
                                onChange={this.handleOptionSelected}
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
                                onChange={this.handleOptionSelected}
                            />
                            <TextField
                                className={classes.formControl}
                                name='setCustomerPhone'
                                label='Customer Phone'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputComponent: PhoneNumberMask
                                }}
                                required={true}
                                value={setCustomerPhone}
                                onChange={this.handleOptionSelected}
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
                </Hidden>
                <Grid item>
                    <Grid container justify='space-evenly' spacing={40}>
                        <Hidden smDown>
                            <Grid item>
                            </Grid>
                        </Hidden>
                        <Grid item>
                            <InfiniteCalendar
                                theme={{
                                    selectionColor: '#3f51b5',
                                    weekdayColor: 'rgb(127, 95, 251)',
                                    headerColor: '#3f51b5'
                                }}
                                width={(isMobile()) ? window.innerWidth * 0.9 : 650}
                                height={window.innerHeight - 250}
                                selected={today}
                                minDate={today}
                                onSelect={this.openAppointmentsToView}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <AppointmentSummary
                    open={this.state.displayAppointmentsToView}
                    appointmentsToView={this.state.appointmentsToView}
                    appointmentsToViewHeaders={this.state.appointmentsToViewHeaders}
                    onClose={this.closeAppointmentsToView}
                />
            </Grid>
        )
    }
}

export default withStyles(styles)(AdminAppointment);
