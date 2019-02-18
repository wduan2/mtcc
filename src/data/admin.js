
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

export const setService = (group, name, duration, id = shortid.generate()) => {
    let service = Service(id, group, name, duration)
    service.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

    return database.collection('service')
        .doc(id)
        .set(service)
}

export const delService = (id) => {
    return database.collection('service')
        .doc(id)
        .delete()
    // staff, appointment
}

export const getStaffs = () => {
    return database.collection('staff').get()
}

export const setStaff = (name, serviceIds, active, id = shortid.generate()) => {
    let staff = Staff(id, name, serviceIds, true)
    staff.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

    return database.collection('staff')
        .doc(id)
        .set(staff)
}

export const delStaff = (id) => {
    return database.collection('staff')
        .doc(id)
        .delete()
    // appointment
}

export const getSchedules = () => {
    return database.collection('schedule').get()
}

export const setSchedule = (staffId, day, start, end) => {
    let schedule = Schedule(staffId, day, start, end)
    schedule.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

    return database.collection('schedule')
        .doc(staffId)
        .set(schedule)
}

export const delSchedule = (staffId) => {
    return database.collection('schedule')
        .doc(staffId)
        .delete()
    // appointment
}

export const getAppointments = () => {
    return database.collection('appointment').get()
}

export const setAppointment = (date, start, end, serviceId, staffId, id = shortid.generate()) => {
    let appointment = Appointment(id, date, start, end, serviceId, staffId, false, false, false)
    appointment.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

    return database.collection('appointment')
        .doc(id)
        .set(appointment)
}

export const delAppointment = (id) => {
    return database.collection('appointment')
        .doc(id)
        .delete()
}

