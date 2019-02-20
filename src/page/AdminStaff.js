import React from 'react';
import Select from 'react-select';
import ReactTable from 'react-table';
import * as adminActions from '../data/admin';


export default class AdminStaff extends React.Component {
    constructor(props) {
        super(props);

        this.handleSetStaffSubmit = this.handleSetStaffSubmit.bind(this)
        this.handleDelStaffSubmit = this.handleDelStaffSubmit.bind(this)
        this.handleSetStaffChange = this.handleSetStaffChange.bind(this)
        this.handleDelStaffChange = this.handleDelStaffChange.bind(this)
        this.state = {
            ...this.defaultInputValues,
            staffList: [],
            submitEnabled: true
        }
    }

    defaultInputValues = {
        setStaffName: '',
        delStaffId: ''
    }

    tableColumns = [
        { Header: 'id', accessor: 'id' },
        { Header: 'name', accessor: 'name' }
    ]

    componentDidMount() {
        // get service list
        this.updateStaffList()
    }

    setSubmitEnabledTo(value = false) {
        this.setState({
            submitEnabled: value
        })
    }

    updateStaffList() {
        adminActions.getStaffs().then((querySnapshot) => {
            const staffList = querySnapshot.docs.map((doc) => doc.data())
            this.setState({ staffList: staffList })
        }).catch((e) => {
            console.error(e)
        })
    }

    handleSetStaffChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSetStaffSubmit(evt) {
        evt.preventDefault()
        this.setSubmitEnabledTo(false)

        const { setStaffName } = this.state

        adminActions.setStaff(setStaffName)
            .then(() => {
                this.updateStaffList()
                this.setSubmitEnabledTo(true)
                this.setState(this.defaultInputValues)
            })
            .catch((e) => {
                console.error(e)
                this.setSubmitEnabledTo(true)
            })
    }

    handleDelStaffChange(opt) {
        this.setState({
            delStaffId: opt.value
        })
    }

    handleDelStaffSubmit(evt) {
        evt.preventDefault()
        this.setSubmitEnabledTo(false)
        adminActions.delService(this.state.delStaffId)
            .then(() => {
                this.updateStaffList()
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
                    <div id='setStaff'>
                        <h3>Set Staff</h3>
                        <form onSubmit={this.handleSetStaffSubmit}>
                            <ol>
                                <li style={{ listStyle: 'none' }}>
                                    <label> Staff Name:</label>
                                    <input type="text" name='setStaffName' value={this.state.setStaffName} onChange={this.handleSetStaffChange} />
                                </li>
                            </ol>
                            <input disabled={!this.state.submitEnabled || !this.state.setStaffName} type='submit' value='set' />
                        </form>
                    </div>
                    <div id='delService'>
                        <h3>Delete Staff</h3>
                        <form onSubmit={this.handleChange}>
                            <label> Staff:</label>
                            <div style={{ width: '50%' }}>
                                <Select
                                    options={this.state.staffList.map((s) => { return { value: s.id, label: s.name } })}
                                    onChange={this.handleDelStaffChange}
                                />
                            </div>
                            <button disabled={!this.state.submitEnabled || !this.state.delStaffId} onClick={this.handleDelStaffSubmit}>delete</button>
                        </form>
                    </div>
                </div>
                <div style={{ width: '75%', float: 'right' }}>
                    <ReactTable
                        columns={this.tableColumns}
                        data={this.state.staffList}
                    />
                </div>
            </div >
        )
    }
}
