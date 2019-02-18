import React from 'react';
import Admin from '../data/admin'

export default class AdminStaff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setStaff: {
                staffName: 'staff name',
                staffServices: [],
            },
            delStaff: {
                staffId: 'staff id'
            }
        }
    }

    componentDidMount() {
        // TODO: get staff list
        // TODO: get service list
    }

    handleSetStaffChange(evt) {
        this.setState({
            setStaff: {
                staffName: evt.target.staffName,
                staffServices: evt.target.staffServices
            }
        })
    }

    handleDelStaffChange(evt) {
        this.setState({
            delStaff: {
                staffId: evt.target.staffId
            }
        })
    }

    handleSetStaffSubmit(evt) {
        evt.preventDefault()
    }

    handleDelStaffSubmit(evt) {
        evt.preventDefault()
    }

    render() {
        return (
            <div>
                <h2 style={{ margin: '20px' }}>
                    AdminStaff
                </h2>
                <div id='setStaff'>
                    <form onSubmit={this.handleSetStaffSubmit}>
                        <label> Staff Name:
                            <input type="text" staffName={this.state.setStaff.staffName} onChange={this.handleChange} />
                        </label>
                        <label>
                            
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div id='delStaff'>
                    <form onSubmit={this.handleDelStaffSubmit}>
                        <label> Staff Id:

                        </label>
                    </form>
                </div>
            </div>
        )
    }
}
