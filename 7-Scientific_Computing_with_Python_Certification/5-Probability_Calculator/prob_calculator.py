import copy
import random

class Hat:
    def __init__(self, **kwargs):
        self.contents = []
        for key, value in kwargs.items():
            for i in range(value):
                self.contents.append(key)
    
    def draw(self, number):
        # If the number of balls to draw exceeds the available quantity, return all the balls.
        if number > len(self.contents):
            number = len(self.contents)

        result = []
        for i in range(number):
            index = random.randint(0, len(self.contents)-1)
            result.append(self.contents.pop(index))
        return result

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
    successful_outcomes = 0
    for i in range(num_experiments):
        # we copy the original hat so that we can redo the experiment again and again
        new_hat = copy.deepcopy(hat)    

        result = new_hat.draw(num_balls_drawn)

        # check if what we got matches our expected balls
        success = True
        for key, value in expected_balls.items():
            if result.count(key) < value:
                success = False
        if success:
            successful_outcomes += 1
    return successful_outcomes/num_experiments