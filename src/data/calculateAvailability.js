import moment from 'moment'

const CHUNK_SIZE = 15

const DAY_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday']

export const calculate = (schedules, selectDayAppointments, staffId, serviceDuration, selectDate) => {
    try {
        // date must be string with 'YYYY-MM-DD' format
        const selectDateMoment = moment(selectDate, 'YYYY-MM-DD')

        if (moment().diff(selectDateMoment, 'days') > 0) {
            console.warn('invalid date')
            return []
        }

        const selectDay = DAY_OF_WEEK[selectDateMoment.weekday()]

        // schedules must be grouped by day of week
        const selectDaysSchedule = schedules[selectDay]

        const staffTimeMap = calcTimeMap(selectDaysSchedule)

        updateBusyTimeChunks(selectDayAppointments, staffTimeMap)

        return calcAvailableTimeChunks(staffTimeMap, serviceDuration, staffId)
    } catch (e) {
        console.error('unable to calculate availablilty', e)
        return []
    }
}

const calcTimeMap = (schedules) => {
    const staffTimeMap = new Map()

    schedules.forEach((schedule) => {
        const start = moment(schedule['start'], 'HH:mm')
        const end = moment(schedule['end'], 'HH:mm')
        const duration = moment.duration(end.diff(start)).as('minutes')

        let startTime = moment(start)
        for (let t = 0; t <= duration; t += CHUNK_SIZE) {
            const time = startTime.format('HH:mm')
            if (staffTimeMap.has(time)) {
                const staffInfo = staffTimeMap.get(time)
                staffInfo['staffs'].push(schedule.staffId)
                staffInfo['staffCount'] += 1
                staffTimeMap.set(time, staffInfo)
            } else {
                staffTimeMap.set(time, {'staffs': [schedule.staffId], 'staffCount': 1})
            }
            startTime.add(CHUNK_SIZE, 'minutes')
        }
    })

    return staffTimeMap
}

const calcTimeChunks = (apptmtStart, apptmtEnd) => {
    const start = moment(apptmtStart, 'HH:mm')
    const end = moment(apptmtEnd, 'HH:mm')
    const duration = moment.duration(end.diff(start)).as('minutes')
    const timeChunks = []

    let chunk = moment(apptmtStart, 'HH:mm')
    for (let t = 0; t <= duration; t += CHUNK_SIZE) {
        timeChunks.push(chunk.format('HH:mm'))
        chunk.add(CHUNK_SIZE, 'minutes')
    }

    return timeChunks
}

const updateBusyTimeChunks = (apptmts, staffTimeMap) => {
    apptmts.forEach((apptmt) => {
        const busyChunks = calcTimeChunks(apptmt.start, apptmt.end)

        // console.log(`calculated time chunks: ${busyChunks} for staff: ${apptmt['staff']} between ${apptmt['start']} and ${apptmt['end']}`)

        busyChunks.forEach((chunk) => {
            if (apptmt.staffId) {
                const staffInfo = staffTimeMap.get(chunk)
                staffInfo['staffs'].splice(staffInfo['staffs'].indexOf(apptmt.staffId), 1)
            }

            staffTimeMap.get(chunk)['staffCount'] -= 1
        })
    })
}

const calcAvailableTimeChunks = (staffTimeMap, serviceDuration, staffId) => {
    const availabilities = []
    staffTimeMap.forEach((staffInfo, candidateStartTime) => {
        if (staffInfo['staffCount'] <= 0) {
            return
        }

        const candidateEndTime = moment(candidateStartTime, 'HH:mm').add(serviceDuration, 'minutes').format('HH:mm')
        const timeChunks = calcTimeChunks(candidateStartTime, candidateEndTime)

        let i = 0
        // make sure exclude the last time chunk of schedule
        while (i < timeChunks.length && staffTimeMap.has(timeChunks[i])) {
            if (staffTimeMap.get(timeChunks[i])['staffCount'] <= 0) {
                return
            } else if (staffId && !staffTimeMap.get(timeChunks[i])['staffs'].includes(staffId)) {
                return
            }
            i += 1
        }

        availabilities.push({ 'start': candidateStartTime, 'end': candidateEndTime })
    })

    return availabilities
}
