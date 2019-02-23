
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import * as shortid from 'shortid';
import { Appointment, Schedule, Service, Staff } from './documents';

const config = {
    apiKey: "AIzaSyDPfl9DQCTCGlTdMExQbByDZEOCRFF3vno",
    authDomain: "mtcc-15237.firebaseapp.com",
    databaseURL: "https://mtcc-15237.firebaseio.com",
    projectId: "mtcc-15237",
    storageBucket: "mtcc-15237.appspot.com",
    messagingSenderId: "704137003456"
};

firebase.initializeApp(config);

const database = firebase.firestore()

export const getServices = () => {
    return database.collection('service').get()
}

export const setService = (group, name, duration, price, id = shortid.generate()) => {
    let service = Service(id, group, name, duration, price)
    service.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

    return database.collection('service')
        .doc(id)
        .set(service)
}

export const delService = (id) => {
    return database.collection('service')
        .doc(id)
        .update({
            'removed': true
        })
    // TODO: update appointments
}

export const getStaffs = () => {
    return database.collection('staff').get()
}

export const getStaffById = (staffId) => {
    return database.collection('staff').where('id', '==', staffId).get()
}

export const setStaff = (name, id = shortid.generate()) => {
    let staff = Staff(id, name)
    staff.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

    return database.collection('staff')
        .doc(id)
        .set(staff)
}

export const delStaff = (id) => {
    return database.collection('staff')
        .doc(id)
        .update({
            'removed': true
        })
    // TODO: update appointments
}

export const getSchedules = () => {
    return database.collection('schedule').get()
}

export const setSchedule = (staffId, day, start, end, id = shortid.generate()) => {
    let schedule = Schedule(id, staffId, day, start, end)
    schedule.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

    return database.collection('schedule')
        .doc(id)
        .set(schedule)
}

export const getAppointments = () => {
    return database.collection('appointment').get()
}

export const getAppointmentByDate = (date) => {
    return database.collection('appointment')
        .where('date', '==', date)
        .get()
}

export const setAppointment = (customerName, customerEmail, customerPhone, date, start, end, serviceId, staffId, id = shortid.generate()) => {
    let appointment = Appointment(id, customerName, customerEmail, customerPhone, date, start, end, serviceId, staffId, false, false, false)
    
    appointment.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

    return database.collection('appointment')
        .doc(id)
        .set(appointment)
}

export const delAppointment = (id) => {
    return database.collection('appointment')
        .doc(id)
        .update({
            'canceled': true
        })
}
