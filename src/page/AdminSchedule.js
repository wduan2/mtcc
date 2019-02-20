import React from 'react';
import Select from 'react-select';
import ReactTable from 'react-table';
import * as adminActions from '../data/admin';


export default class AdminSchedule extends React.Component {
    constructor(props) {
        super(props);

        this.handleSetScheduleSubmit = this.handleSetScheduleSubmit.bind(this)
        this.handleDelScheduleSubmit = this.handleDelScheduleSubmit.bind(this)
        this.handleSetScheduleChange = this.handleSetScheduleChange.bind(this)
        this.handleDelScheduleChange = this.handleDelScheduleChange.bind(this)
        this.handleSetScheduleOption = this.handleSetScheduleOption.bind(this)
        this.state = {
            ...this.defaultInputValues,
            schedules: [],
            staffs: [],
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday'],
            submitEnabled: true
        }
    }

    defaultInputValues = {
        setStaffId: '',
        setDay: '',
        setStart: '',
        setEnd: '',
        delScheduleId: ''
    }

    tableColumns = [
        { Header: 'staffId', accessor: 'staffId' },
        { Header: 'staffName', accessor: 'staffName' },
        { Header: 'Monday', accessor: 'mondaySchedule' },
        { Header: 'Tuesday', accessor: 'tuesdaySchedule' },
        { Header: 'Wednesday', accessor: 'wednesdaySchedule' },
        { Header: 'Thrusday', accessor: 'thrusdaySchedule' },
        { Header: 'Friday', accessor: 'fridaySchedule' },
        { Header: 'Saturday', accessor: 'saturdaySchedule' },
        { Header: 'Sunday', accessor: 'sundaySchedule' },
    ]

    componentDidMount() {
        this.updateScheduleList()
    }

    setSubmitEnabledTo(value = false) {
        this.setState({
            submitEnabled: value
        })
    }

    updateScheduleList() {
        adminActions.getStaffs().then((querySnapshot) => {
            const staffs = {}
            querySnapshot.forEach((doc) => {
                const staff = doc.data()
                staffs[staff.id] = staff
            })
            this.setState({ staffs: staffs })

            adminActions.getSchedules().then((querySnapshot) => {
                const schedules = {}
                querySnapshot.forEach((doc) => {
                    const schedule = doc.data()
                    schedules[schedule.staffId] = schedules[schedule.staffId] || {}
                    schedules[schedule.staffId][schedule.day] = schedules[schedule.staffId][schedule.day] || {}
                    schedules[schedule.staffId][schedule.day] = { ...schedule }
                    schedules[schedule.staffId]['staffId'] = schedule.staffId
                    schedules[schedule.staffId]['staffName'] = this.state.staffs[schedule.staffId]
                })
                this.setState({
                    schedules: schedules
                })
            }).catch((e) => {
                console.error(e)
            })
        })
    }

    handleSetScheduleOption(opt) {
        this.setState({
            [opt.name]: opt.value
        })
    }

    handleSetScheduleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSetScheduleSubmit(evt) {
        evt.preventDefault()
        this.setSubmitEnabledTo(false)

        const { setStaffId, setDay, setStart, setEnd } = this.state

        adminActions.setSchedule(setStaffId, setDay, setStart, setEnd)
            .then(() => {
                this.updateScheduleList()
                this.setSubmitEnabledTo(true)
                this.setState(this.defaultInputValues)
            })
            .catch((e) => {
                console.error(e)
                this.setSubmitEnabledTo(true)
            })
    }

    handleDelScheduleChange(opt) {
        this.setState({
            [opt.name]: opt.value
        })
    }

    handleDelScheduleSubmit(evt) {
        evt.preventDefault()
        this.setSubmitEnabledTo(false)
        adminActions.delSchedule(this.state.delScheduleId)
            .then(() => {
                this.updateScheduleList()
                this.setSubmitEnabledTo(true)
                this.setState(this.defaultInputValues)
            })
            .catch((e) => {
                console.error(e)
                this.setSubmitEnabledTo(true)
            })
    }

    render() {
        return (
            <div>
                <div style={{ width: '25%', float: 'left' }}>
                    <div id='setSchedule'>
                        <h3>Set Schedule</h3>
                        <form onSubmit={this.handleSetScheduleSubmit}>
                            <ol>
                                <li style={{ listStyle: 'none' }}>
                                    <label>Staff:</label>
                                    <Select
                                        options={Object.values(this.state.staffs).map((staff) => { return { value: staff.id, label: staff.name, name: 'setStaffId' } })}
                                        onChange={this.handleSetScheduleOption}
                                    />
                                </li>
                                <li style={{ listStyle: 'none', display: this.state.setStaffId ? 'block' : 'none' }}>
                                    <label>Day:</label>
                                    <Select
                                        options={this.state.days.map((day) => { return { value: day, label: day, name: 'setDay' } })}
                                        onChange={this.handleSetScheduleOption}
                                    />
                                </li>
                                <li style={{ listStyle: 'none', display: this.state.setStaffId && this.state.setDay ? 'block' : 'none' }}>
                                    <label>Start</label>
                                    <input type="text" name='setStart' value={this.state.setStart} onChange={this.handleSetScheduleChange} />
                                </li>
                                <li style={{ listStyle: 'none', display: this.state.setStaffId && this.state.setDay && this.state.setStart ? 'block' : 'none' }}>
                                    <label>End</label>
                                    <input type="text" name='setEnd' value={this.state.setEnd} onChange={this.handleSetScheduleChange} />
                                </li>
                            </ol>
                            <input disabled={!this.state.submitEnabled || !this.state.setStaffId || !this.state.setDay || !this.state.setStart || !this.state.setEnd} type='submit' value='set' />
                        </form>
                    </div>
                </div>

                <div style={{ width: '75%', float: 'right' }}>
                    <ReactTable
                        columns={this.tableColumns}
                        data={Object.values(this.state.schedules)}
                    />
                </div>
            </div >
        )
    }
}
