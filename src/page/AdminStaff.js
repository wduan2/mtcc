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
class AdminStaff extends React.Component {
    constructor(props) {
        super(props);

        this.handleSetStaffSubmit = this.handleSetStaffSubmit.bind(this)
        this.handleDelStaffSubmit = this.handleDelStaffSubmit.bind(this)
        this.handleOptionSelected = this.handleOptionSelected.bind(this)
    }

    state = {
        setStaffName: '',
        delStaffId: '',
        staffList: [],
        submitEnabled: true
    }

    resetState() {
        this.setState({
            setStaffName: '',
            delStaffId: ''
        })
    }

    tableHeaders = ['id', 'name']

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
            const staffList = querySnapshot.docs.map((doc) => {
                const staffData = doc.data()
                const staff = {}
                this.tableHeaders.forEach((header) => {
                    staff[header] = staffData[header]
                })
                return staff
            })
            this.setState({ staffList: staffList })
        }).catch((e) => {
            console.error(e)
        })
    }

    handleOptionSelected(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSetStaffSubmit(evt) {
        this.setSubmitEnabledTo(false)

        const { setStaffName } = this.state

        adminActions.setStaff(setStaffName)
            .then(() => {
                this.updateStaffList()
                this.setSubmitEnabledTo(true)
                this.resetState()
            })
            .catch((e) => {
                console.error(e)
                this.setSubmitEnabledTo(true)
            })
    }

    handleDelStaffSubmit(evt) {
        evt.preventDefault()
        this.setSubmitEnabledTo(false)
        adminActions.delService(this.state.delStaffId)
            .then(() => {
                this.updateStaffList()
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
        const { setStaffName, delStaffId, staffList, submitEnabled } = this.state

        return (
            <div className={classes.container}>
                <Grid container spacing={16}>
                    <Grid item xs={2}>
                        <h3>Set Staff</h3>
                        <form className={classes.container} noValidate>
                            <TextField
                                name='setStaffName'
                                label='Staff Name'
                                type='text'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required={true}
                                value={setStaffName}
                                onChange={(this.handleOptionSelected)}
                            />
                            <Button
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                disabled={!submitEnabled || !setStaffName}
                                onClick={this.handleSetStaffSubmit}
                            >
                                Set
                            </Button>
                        </form>

                        <h3>Remove Staff</h3>
                        <form onSubmit={this.handleChange}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="del-staff">Staff</InputLabel>
                                <Select
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{
                                        name: 'delStaffId',
                                        id: 'del-staff',
                                    }}
                                    value={delStaffId}
                                    onChange={this.handleOptionSelected}
                                >
                                    {staffList.map((staff) => <MenuItem key={staff.id} value={staff.name}>{staff.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                disabled={!submitEnabled || !delStaffId}
                                onClick={this.handleDelStaffSubmit}
                            >
                                Remove
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={10}>
                        <CustomPaginationActionsTable headers={this.tableHeaders} rows={staffList} />
                    </Grid>
                </Grid>
            </div >
        )
    }
}

export default withStyles(styles)(AdminStaff);
