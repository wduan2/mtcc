export const Schedule = (id, staffId, day, start, end) => {
    return {
        id: id,
        staffId: staffId,
        day: day,
        start: start,
        end: end
    }
}

export const Service = (id, group, name, duration, removed = false) => {
    return {
        id: id,
        group: group,
        name: name,
        duration: duration,
        removed: removed
    }
}

export const Staff = (id, name, serviceIds = [], removed = false) => {
    return {
        id: id,
        name: name,
        serviceIds: serviceIds,
        removed: removed
    }
}

export const Appointment = (id, customerName, customerEmail, customerPhone, date, start, end, serviceId, staffId = null, canceled = false, staffRemoved = false, serviceRemoved = false) => {
    const appontment = {
        id: id,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        date: date,
        start: start,
        end: end,
        serviceId: serviceId,
        canceled: canceled,
        staffRemoved: staffRemoved,
        serviceRemoved: serviceRemoved
    }

    if (staffId) {
        appontment['staffId'] = staffId
    }

    return appontment
}
