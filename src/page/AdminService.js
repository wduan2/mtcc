import React from 'react';
import Select from 'react-select';
import ReactTable from 'react-table';
import * as adminActions from '../data/admin';


export default class AdminService extends React.Component {
    constructor(props) {
        super(props);

        this.handleSetServiceSubmit = this.handleSetServiceSubmit.bind(this)
        this.handleDelServiceSubmit = this.handleDelServiceSubmit.bind(this)
        this.handleSetServiceChange = this.handleSetServiceChange.bind(this)
        this.handleDelServiceChange = this.handleDelServiceChange.bind(this)
        this.state = {
            ...this.defaultInputValues,
            serviceList: [],
            submitEnabled: true
        }
    }

    defaultInputValues = {
        setServiceName: '',
        setServiceGroup: '',
        setServiceDuration: '',
        delServiceId: ''
    }

    tableColumns = [
        {
            Header: 'id',
            accessor: 'id'
        },
        {
            Header: 'group',
            accessor: 'group'
        },
        {
            Header: 'name',
            accessor: 'name'
        },
        {
            Header: 'duration',
            accessor: 'duration'
        }
    ]

    componentDidMount() {
        // get service list
        this.updateServiceList()
    }

    setSubmitEnabledTo(value = false) {
        this.setState({
            submitEnabled: value
        })
    }

    updateServiceList() {
        adminActions.getServices().then((querySnapshot) => {
            const serviceList = []
            querySnapshot.forEach((doc) => {
                serviceList.push(doc.data())
            })
            this.setState({
                serviceList: serviceList
            })
        }).catch((e) => {
            console.error(e)
        })
    }

    handleSetServiceChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSetServiceSubmit(evt) {
        evt.preventDefault()
        this.setSubmitEnabledTo(false)

        const { setServiceGroup, setServiceName, setServiceDuration } = this.state

        adminActions.setService(setServiceGroup, setServiceName, setServiceDuration)
            .then(() => {
                this.updateServiceList()
                this.setSubmitEnabledTo(true)
                this.setState(this.defaultInputValues)
            })
            .catch((e) => {
                console.error(e)
                this.setSubmitEnabledTo(true)
            })
    }

    handleDelServiceChange(opt) {
        this.setState({
            delServiceId: opt.value
        })
    }

    handleDelServiceSubmit(evt) {
        evt.preventDefault()
        this.setSubmitEnabledTo(false)
        adminActions.delService(this.state.delServiceId)
            .then(() => {
                this.updateServiceList()
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
                    <div id='setService'>
                        <h3>Set Service</h3>
                        <form onSubmit={this.handleSetServiceSubmit}>
                            <ol>
                                <li style={{ listStyle: 'none' }}>
                                    <label> Service Group:</label>
                                    <input type="text" name='setServiceGroup' value={this.state.setServiceGroup} onChange={this.handleSetServiceChange} />
                                </li>
                                <li style={{ listStyle: 'none' }}>
                                    <label> Service Name:</label>
                                    <input type="text" name='setServiceName' value={this.state.setServiceName} onChange={this.handleSetServiceChange} />
                                </li>
                                <li style={{ listStyle: 'none' }}>
                                    <label> Service Duraiton:</label>
                                    <input type="text" name='setServiceDuration' value={this.state.setServiceDuration} onChange={this.handleSetServiceChange} />
                                </li>
                            </ol>
                            <input disabled={!this.state.submitEnabled} type='submit' value='set' />
                        </form>
                    </div>
                    <div id='delService'>
                        <h3>Delete Service</h3>
                        <form onSubmit={this.handleChange}>
                            <label> Service:</label>
                            <div style={{ width: '50%' }}>
                                <Select
                                    options={this.state.serviceList.map((s) => { return { value: s.id, label: s.name } })}
                                    onChange={this.handleDelServiceChange}
                                />
                            </div>
                            <button disabled={!this.state.submitEnabled} onClick={this.handleDelServiceSubmit}>delete</button>
                        </form>
                    </div>
                </div>
                <div style={{ width: '75%', float: 'right' }}>
                    <ReactTable
                        columns={this.tableColumns}
                        data={this.state.serviceList}
                    />
                </div>
            </div >
        )
    }
}
