import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def extrapolate(x, y, start, end):
    # first, determine the slope of the line
    (slope, intercept, rvalue, pvalue, stderr) = linregress(x, y)
    # then, build the x and y 'coordinates' based on the required range
    x_fut = [i for i in range(start, end)]
    y_fut = []
    for i in x_fut:
        y_fut.append(intercept + slope * i)
    return x_fut, y_fut

def draw_plot():
    df = pd.read_csv('./epa-sea-level.csv')
    x = df['Year']
    y = df['CSIRO Adjusted Sea Level']

    # Create scatter plot
    fig = plt.figure(figsize=(8, 8))
    plt.scatter(x, y, alpha=0.5)

    # Create first line of best fit
    x_fut, y_fut = extrapolate(x, y, 1880, 2050)
    plt.plot(x_fut, y_fut, color="green")

    # Create second line of best fit
    df = df[df['Year'] >= 2000] # reset the dataframe with the desired values
    x = df['Year']  # x and y need to be reset based on new df values.
    y = df['CSIRO Adjusted Sea Level']

    x_fut, y_fut = extrapolate(x, y, 2000, 2050)
    plt.plot(x_fut, y_fut, color="red")
    # plt.show()

    # Add labels and title
    plt.title('Rise in Sea Level')
    plt.xlabel('Year')
    plt.ylabel('Sea Level (inches)')
    
    # Save plot and return data for testing (DO NOT MODIFY)
    plt.savefig('sea_level_plot.png')
    return plt.gca()
    