import moment from 'moment'

const CHUNK_SIZE = 15

const DAY_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday']

export const calculate = (schedules, appointments, staffList, staffId, serviceDuration, date) => {
    try {
        // date must be string with 'YYYY-MM-DD' format
        const today = moment(date, 'YYYY-MM-DD')
        const todaysDay = DAY_OF_WEEK[today.weekday()]

        // appointments must be grouped by date
        const todaysAppointments = appointments[date]

        // schedules must be grouped by day of week
        const todaysSchedule = schedules[todaysDay]

        const timeMap = calcTimeMap(todaysSchedule.start, todaysSchedule.end, staffList.map((staff) => staff.id))

        updateBusyTimeChunks(todaysAppointments, timeMap)

        return calcAvailableTimeChunks(timeMap, serviceDuration, staffId)
    } catch (e) {
        console.error('unable to calculate availablilty', e)
        return []
    }
}

const calcTimeMap = (workdayStart, workdayEnd, staffs) => {
    const start = moment(workdayStart, 'HH:mm')
    const end = moment(workdayEnd, 'HH:mm')
    const duration = moment.duration(end.diff(start)).as('minutes')
    const timeMap = new Map()

    let currentTime = moment(workdayStart)
    for (let t = 0; t <= duration; t += CHUNK_SIZE) {
        timeMap.set(currentTime.format('HH:mm'), { 'staffs': [...staffs.map((staff) => staff.id)], 'staffCount': staffs.length })
        currentTime.add(CHUNK_SIZE, 'minutes')
    }

    return timeMap
}

const calcTimeChunks = (apptmtStart, apptmtEnd) => {
    const start = moment(apptmtStart, 'HH:mm')
    const end = moment(apptmtEnd, 'HH:mm')
    const duration = moment.duration(start.diff(end)).as('minutes')
    const timeChunks = []

    let currentTime = moment(apptmtStart)
    for (let t = 0; t <= duration; t += CHUNK_SIZE) {
        timeChunks.push(currentTime.format('HH:mm'))
        currentTime.add(CHUNK_SIZE, 'minutes')
    }

    return timeChunks
}

const updateBusyTimeChunks = (apptmts, timeMap) => {
    apptmts.forEach((apptmt) => {
        const timeChunks = calcTimeChunks(apptmt['start'], apptmt['end'])

        // console.log(`calculated time chunks: ${timeChunks} for staff: ${apptmt['staff']} between ${apptmt['start']} and ${apptmt['end']}`)

        timeChunks.forEach((time) => {
            // if (!timeMap.has(time)) {
            //     return
            // }

            if (apptmt['staffId']) {
                timeMap.get(time)['staffs'].splice(staffs.indexOf(apptmt['staffId']), 1)
            }

            timeMap.get(time)['staffCount']--

            // console.log(`remove staff: ${apptmt['staff']} at time chunk: ${time}`)
        })
    })
}

const calcAvailableTimeChunks = (timeMap, serviceDuration, staffId) => {
    const availabilities = []
    timeMap.forEach((staffInfo, candidateStartTime) => {
        if (staffInfo['staffCount'] <= 0) {
            return
        }

        const candidateEndTime = moment(candidateStartTime, 'HH:mm').add(serviceDuration, 'minutes').format('HH:mm')
        const timeChunks = calcTimeChunks(candidateStartTime, candidateEndTime)

        let i = 0
        while (i++ < timeChunks.size) {
            if (timeMap[timeChunks[i]]['staffCount'] <= 0) {
                return
            } else if (staffId && !timeMap[timeChunks[i]]['staffs'].includes(staffId)) {
                return
            }
        }

        availabilities.push({ 'start': candidateStartTime, 'end': candidateEndTime })
    })

    return availabilities
}
