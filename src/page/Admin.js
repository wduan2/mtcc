import React from 'react';
import AdminAppointment from './AdminAppointment';
import AdminSchedule from './AdminSchedule';
import AdminService from './AdminService';
import AdminStaff from './AdminStaff';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tabIndex: 0 };
    }

    handleChange = (event, value) => {
        this.setState({ tabIndex: value });
    };

    render() {
        const { classes } = this.props
        const { tabIndex } = this.state

        return (
            <div className={classes.root}>
                <AppBar position='static'>
                    <Tabs value={tabIndex} onChange={this.handleChange}>
                        <Tab label='Service' />
                        <Tab label='Schedule' />
                        <Tab label='Staff' />
                        <Tab label='SeStaffrvice' />
                    </Tabs>
                </AppBar>
                {tabIndex === 0 && <TabContainer><AdminService /></TabContainer>}
                {tabIndex === 1 && <TabContainer><AdminSchedule /></TabContainer>}
                {tabIndex === 2 && <TabContainer><AdminStaff /></TabContainer>}
                {tabIndex === 3 && <TabContainer><AdminAppointment /></TabContainer>}
            </div>
        )
    }
}

export default withStyles(styles)(Admin)
