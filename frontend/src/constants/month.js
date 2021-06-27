const {
    startOfMonth,
    startOfWeek,
    endOfMonth,
    endOfWeek,
    startOfDay,
    addDays,
} = require("date-fns")


const takeWeek = (start = new Date()) => {
    let date = startOfWeek(startOfDay(start, 1))

    return () => {
        const week = [...Array(7)].map((_, i) => addDays(date, i))
        date = addDays(week[6], 1)
        return week
    }
}

export const takeMonth = (start = new Date()) => {
    let month = []
    let date = start

    const lastDayOfRange = (range) => {
        return range[range.length - 1][6]
    }

    return () => {
        const weekGenerator = takeWeek(startOfMonth(date))
        const endDate = startOfDay(endOfWeek(endOfMonth(date)))
        month.push(weekGenerator())

        while (lastDayOfRange(month) < endDate) {
            month.push(weekGenerator())        
        }

        let range = month
        month = []
        date = addDays(lastDayOfRange(range), 1)

        return range
    }
}