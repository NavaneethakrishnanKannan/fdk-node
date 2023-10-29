exports.formatDate = (date, daysToAdd) => {
    try {
        let newDate = new Date(new Date(date).setDate(new Date(date).getDate() + daysToAdd));
        return (((newDate.getMonth() > 8) ? (newDate.getMonth() + 1) : ('0' + (newDate.getMonth() + 1))) + '-' + ((newDate.getDate() > 9) ? newDate.getDate() : ('0' + newDate.getDate())) + '-' + newDate.getFullYear());
    } catch (error) {
        console.log(error);
    }
}

exports.getDateDiff = (date1, date2) => {
    try {
        date1 = new Date(date1);
        date2 = new Date(date2);
        console.log({ date2, date1 })
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
        console.log(error);
    }
}

exports.addMinutes = (minutes, date = new Date()) => {  
    if (typeof minutes !== 'number') {
      throw new Error('Invalid "minutes" argument')
    }
    if (!(date instanceof Date)) {
      throw new Error('Invalid "date" argument')
    }
  
    date.setMinutes(date.getMinutes() + minutes)
  
    return date
  }