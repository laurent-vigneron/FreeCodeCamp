class Category:
    def __init__(self, name):
        self.name = name
        self.balance = 0
        self.ledger = []
        self.total_spent = 0    # will be useful for the second part of the exercise (the graph)

    def get_balance(self):
        return self.balance

    def check_funds(self, amount):  # Using the Ternary Operator
        return True if self.balance - amount >= 0 else False

    def deposit(self, amount, title=''):
        self.balance += amount
        self.ledger.append({'description': title, 'amount': amount })
        return True

    def withdraw(self, amount, title=''):
        if self.check_funds(amount):
            self.balance -= amount
            self.ledger.append({'description': title, 'amount': -amount })
            self.total_spent += amount
            return True
        else:
            return False

    def transfer(self, amount, target):
        if self.withdraw(amount, 'Transfer to '+target.name):
            target.deposit(amount, 'Transfer from '+self.name)
            return True
        else:
            return False

    def __str__(self):
        result = f'{self.name:*^30s}\n'
        for line in self.ledger:
            result += f'{line["description"][:23]:<23s}{line["amount"]:>7.2f}\n'
        result += f'Total: {self.balance}'
        return result


def create_spend_chart(categories):
    result = ''
    # Step 1: get the respective percentages
    totals = []
    total_amount = 0 
    for cat in categories:
        totals.append(cat.total_spent)
        total_amount += cat.total_spent
    percents = []
    for num, amount in enumerate(totals):
        percents.append(totals[num]/total_amount)
    print(percents)
    
    # Step 2: draw the graph (Y-Axis + dots)
    result += 'Percentage spent by category\n'
    for i in range(11):
        dots = ''
        for num in percents:
            if num*100 >= (100-i*10):
                dots += ' o '
            else:
                dots += '   '
        line = f'{100-i*10:3d}|{dots}'
        result += line + ' \n'
    
    # Step 3: draw the X-Axis
    max_val = 0
    for cat in categories:
        if len(cat.name) >= max_val:
            max_val = len(cat.name) # Calculate the length of the longest category name
    result += '    ' + '-'*(len(categories)*3+1) + '\n'
    for i in range(max_val):
        line = '    '
        for cat in categories:
            if i < len(cat.name):
                line += f' {cat.name[i]} '
            else:
                line += '   '
        result += line + ' \n'

    return result[0:-1]     # Remove the last trailing '\n'