import React from 'react';
import 'react-table/react-table.css';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import AdminAppointment from './AdminAppointment';
import AdminSchedule from './AdminSchedule';
import AdminService from './AdminService';
import AdminStaff from './AdminStaff';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tabIndex: 0 };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h2 style={{ margin: '20px' }}>
                    Admin Page
                </h2>
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                    <TabList>
                        <Tab>Service</Tab>
                        <Tab>Schedule</Tab>
                        <Tab>Staff</Tab>
                        <Tab>Appointment</Tab>
                    </TabList>

                    <TabPanel>
                        <AdminService />
                    </TabPanel>
                    <TabPanel>
                        <AdminSchedule />
                    </TabPanel>
                    <TabPanel>
                        <AdminStaff />
                    </TabPanel>
                    <TabPanel>
                        <AdminAppointment />
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}
