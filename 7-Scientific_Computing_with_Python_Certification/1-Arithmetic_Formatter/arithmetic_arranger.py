# returns the length of the biggest 'word' in a string
def max_val(string):
    result = 0
    for s in string.split(' '):
        if len(s) >= result:
            result = len(s)
    return result

def arithmetic_arranger(problems, solve=False):
    # Error: Too many problems.
    if len(problems) > 5: 
        return 'Error: Too many problems.'

    # no problem detected, proceeding to formating the content
    col_width = []
    lines = ['','','']
    for num, problem in enumerate(problems):
        total = 0
        for item_num, item in enumerate(problem.split()):
            # Error: Numbers must only contain digits.
            if item_num == 0 or item_num == 2:
                if not item.isnumeric():
                    return 'Error: Numbers must only contain digits.' 
                # Error: Numbers cannot be more than four digits.
                if len(item) > 4:
                    return 'Error: Numbers cannot be more than four digits.'
            if item_num == 1:
                sign = item
            if item_num == 0:
                lines[0] += '{val:>{w}d}    '.format(w=max_val(problem)+2, val=int(item))
                total += int(item)
            elif item_num == 2:
                if sign == '+':
                    lines[1] += '{val:=+{w}d}    '.format(w=max_val(problem)+2, val=int(item))
                    total += int(item)
                elif sign == '-':
                    lines[1] += '{val:=+{w}d}    '.format(w=max_val(problem)+2, val=-int(item))
                    total -= int(item)
                else:
                    # Error: Operator must be '+' or '-'.
                    return "Error: Operator must be '+' or '-'."

        lines[2] += '-'*(max_val(problem)+2)+'    '
        if solve == True:
            if num == 0:
                lines.append('{val:>{w}d}    '.format(w=max_val(problem)+2, val=total))
            else:
                lines[3] += '{val:>{w}d}    '.format(w=max_val(problem)+2, val=total)

    # Format the result and return it
    result = '' 
    for line in lines:
        result += line[0:-4] +'\n'  # Removes the last 4 trailing spaces on each line
    return result[0:-1] # Removes the last '\n'