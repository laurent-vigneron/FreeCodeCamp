import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()

# Import data (Make sure to parse dates. Consider setting index column to 'date'.)
df = pd.read_csv('./fcc-forum-pageviews.csv', index_col=0, parse_dates=True)

# Clean data
df = df[(df['value'] >= (df['value'].quantile(0.025))) & (df['value'] <= (df['value'].quantile(0.975)))]

def draw_line_plot():
    # Draw line plot
    fig = df.plot(title='Daily freeCodeCamp Forum Page Views 5/2016-12/2019', 
                xlabel='Date',
                ylabel='Page Views',
                figsize=(15,5),
                legend=False,
                style='-r').get_figure()

    # Save image and return fig (don't change this part)
    fig.savefig('line_plot.png')
    return fig

def draw_bar_plot():
    # Copy and modify data for monthly bar plot
    df_bar = df.copy()
    df_bar['year'] = df_bar.index.year
    df_bar['Months'] = df_bar.index.month_name()

    months = ['January', 'February', 'March', 'April','May','June', 'July', 'August','September', 'October', 'November', 'December']
    df_bar['Months'] = pd.CategoricalIndex(df_bar['Months'], categories=months, ordered=True)

    df_bar.set_index('year', inplace=True)
    df_bar = df_bar.groupby([df_bar.index, df_bar['Months']])['value'].sum().unstack()

    # Draw bar plot
    fig = df_bar.plot(kind='bar',
                    xlabel='Years',
                    ylabel='Average Page Views',
                    figsize=(9,9),
                    legend=True).get_figure()

    # Save image and return fig (don't change this part)
    fig.savefig('bar_plot.png')
    return fig

def draw_box_plot():
    # Prepare data for box plots (this part is done!)
    df_box = df.copy()
    df_box.reset_index(inplace=True)
    df_box['Year'] = [d.year for d in df_box.date]
    df_box['Month'] = [d.strftime('%b') for d in df_box.date]
    df_box = df_box.rename(columns={'value':'Page Views'})

    # Draw box plots (using Seaborn)
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 8))
    
    sns.boxplot(x='Year', y='Page Views', data=df_box, ax=ax1)
    sns.boxplot(x='Month', y='Page Views', data=df_box, ax=ax2, 
                order=['Jan', 'Feb', 'Mar', 'Apr','May','Jun', 'Jul', 'Aug','Sep', 'Oct', 'Nov', 'Dec'])
    ax1.set_title('Year-wise Box Plot (Trend)')
    ax2.set_title('Month-wise Box Plot (Seasonality)')

    # Save image and return fig (don't change this part)
    fig.savefig('box_plot.png')
    return fig
