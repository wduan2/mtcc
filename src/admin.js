import { firebase } from '@firebase/app';
import '@firebase/firestore';
import React from 'react';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.datastore = firebase.firestore()
    }

    /**
     * Add target="_blank" attribute to the <a> tag for opening link in new tab
     * Add rel='noopener' or rel='noreferrer' to link to disable window.opener
     */
    render() {
        return (
            <div style={{ margin: '20px' }}>
                FO
            </div>
        )
    }
}
