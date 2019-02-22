import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import * as adminActions from '../data/admin';
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

class AdminService extends React.Component {
    constructor(props) {
        super(props);

        this.handleSetServiceSubmit = this.handleSetServiceSubmit.bind(this)
        this.handleDelServiceSubmit = this.handleDelServiceSubmit.bind(this)
        this.handleOptionSelected = this.handleOptionSelected.bind(this)
    }

    state = {
        setServiceName: '',
        setServiceGroup: '',
        setServiceDuration: '',
        delServiceId: '',
        serviceList: [],
        submitEnabled: true
    }

    resetState() {
        this.setState({
            setServiceName: '',
            setServiceGroup: '',
            setServiceDuration: '',
            delServiceId: ''
        })
    }

    tableHeaders = ['id', 'group', 'name', 'duration']

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
            const serviceList = querySnapshot.docs.map((doc) => {
                const serviceData = doc.data()
                const service = {}
                this.tableHeaders.forEach((header) => {
                    service[header] = serviceData[header]
                })
                return service
            })
            this.setState({ serviceList: serviceList })
        }).catch((e) => {
            console.error(e)
        })
    }

    handleOptionSelected(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSetServiceSubmit(evt) {
        this.setSubmitEnabledTo(false)

        const { setServiceGroup, setServiceName, setServiceDuration } = this.state

        adminActions.setService(setServiceGroup, setServiceName, setServiceDuration)
            .then(() => {
                this.updateServiceList()
                this.setSubmitEnabledTo(true)
                this.resetState()
            })
            .catch((e) => {
                console.error(e)
                this.setSubmitEnabledTo(true)
            })
    }

    handleDelServiceSubmit(evt) {
        evt.preventDefault()
        this.setSubmitEnabledTo(false)
        adminActions.delService(this.state.delServiceId)
            .then(() => {
                this.updateServiceList()
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
        const { setServiceName, setServiceGroup, setServiceDuration, delServiceId, serviceList, submitEnabled } = this.state

        return (
            <div className={classes.container}>
                <Grid container spacing={16}>
                    <Grid item xs={2}>
                        <h3>Set Service</h3>
                        <form className={classes.container} noValidate>
                            <TextField
                                name='setServiceGroup'
                                label='Service Group'
                                type='text'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required={true}
                                value={setServiceGroup}
                                onChange={(this.handleOptionSelected)}
                            />
                            <TextField
                                name='setServiceName'
                                label='Service Name'
                                type='text'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required={true}
                                value={setServiceName}
                                onChange={(this.handleOptionSelected)}
                            />
                            <TextField
                                name='setServiceDuration'
                                label='Service Duration'
                                type='text'
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required={true}
                                value={setServiceDuration}
                                onChange={(this.handleOptionSelected)}
                            />
                            <Button
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                disabled={!submitEnabled || !setServiceGroup || !setServiceName || !setServiceDuration}
                                onClick={this.handleSetServiceSubmit}
                            >
                                Set
                            </Button>
                        </form>

                        {/* <h3>Delete Service</h3>
                        <form>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="del-service">Service</InputLabel>
                                <Select
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{
                                        name: 'delServiceId',
                                        id: 'del-service',
                                    }}
                                    value={delServiceId}
                                    onChange={this.handleOptionSelected}
                                >
                                    {serviceList.map((service) => <MenuItem key={service.id} value={service.name}>{service.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                disabled={!submitEnabled || !delServiceId}
                                onClick={this.handleDelServiceSubmit}
                            >
                                Delete
                            </Button>
                        </form> */}
                    </Grid>
                    <Grid item xs={10}>
                        <CustomPaginationActionsTable headers={this.tableHeaders} rows={serviceList} />
                    </Grid>
                </Grid>
            </div >
        )
    }
}

export default withStyles(styles)(AdminService);
