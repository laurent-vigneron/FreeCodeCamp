def inverse(s):
    return "AM" if (s == 'PM') else "PM"

def add_time(start, duration, day=''):
    shift_hours, shift_mins = duration.split(':')
    start_hour = start.split(' ')[0].split(':')[0]
    start_min  = start.split(' ')[0].split(':')[1]
    start_part = start.split(' ')[1]

    # print(f'adding {shift_hours} hours and {shift_mins} mins to {start_hour}:{start_min} {start_part}')

    new_hours  = int(start_hour)
    new_mins   = int(start_min)
    new_part   = start_part
    days_later = 0
    # Add the minutes first
    for i in range(int(shift_mins)):
        new_mins += 1
        if new_mins == 60:
            new_mins = 0;
            shift_hours = int(shift_hours) + 1
    # then add the hours
    for i in range(int(shift_hours)):
        new_hours += 1
        if new_hours == 12:
            new_part = inverse(new_part)
            if new_part == 'AM':
                days_later += 1
        if new_hours == 13:
            new_hours = 1
    
    # If a day was provided, need to take care of that as well
    if day!='':
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        index = days.index(day.capitalize())
        day = days[(index+days_later)%7]

    # Final checks before returning
    if days_later > 0:
        # Going to future days, need to format the string accordingly
        if days_later == 1:
            days_later = 'next day'
        else: 
            days_later = str(days_later) + ' days later'
        if day != '':
            return (f'{new_hours}:{new_mins:02d} {new_part}, {day} ({days_later})')
        else:
            return (f'{new_hours}:{new_mins:02d} {new_part} ({days_later})')
    if day != '':
        return (f'{new_hours}:{new_mins:02d} {new_part}, {day}')
    else:
        return (f'{new_hours}:{new_mins:02d} {new_part}')