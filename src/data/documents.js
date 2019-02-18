export const Schedule = (staffId, day, start, end) => {
    return {
        staffId: staffId,
        day: day,
        start: start,
        end: end
    }
}

export const Service = (id, group, name, duration) => {
    return {
        id: id,
        group: group,
        name: name,
        duration: duration
    }
}

export const Staff = (id, name, serviceIds, active) => {
    return {
        id: id,
        name: name,
        serviceIds: serviceIds,
        active: active
    }
}

export const Appointment = (id, date, start, end, serviceId, staffId, canceled, adjustStaff, adjustService) => {
    return {
        id: id,
        date: date,
        start: start,
        end: end,
        serviceId: serviceId,
        staffId: staffId,
        canceled: canceled,
        adjustStaff: adjustStaff,
        adjustService: adjustService
    }
}