import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Import data
df = pd.read_csv('./medical_examination.csv')

# Add 'overweight' column
df['overweight'] = df['weight'] / ((df['height']/100)**2) > 25
df['overweight'] = df['overweight'].astype(np.int8)

# Normalize data by making 0 always good and 1 always bad. If the value of 'cholestorol' or 'gluc' is 1, make the value 0. If the value is more than 1, make the value 1.
df['cholesterol'] = df['cholesterol'] > 1 
df['gluc'] = df['gluc'] > 1
df['cholesterol'] = df['cholesterol'].astype(np.int8) 
df['gluc'] = df['gluc'].astype(np.int8)

# Draw Categorical Plot
def draw_cat_plot():
    # Create DataFrame for cat plot using `pd.melt` using just the values from 'cholesterol', 'gluc', 'smoke', 'alco', 'active', and 'overweight'.
    df_cat = pd.melt(df, id_vars = ['cardio'], value_vars = ['cholesterol', 'gluc', 'smoke', 'alco', 'active', 'overweight'])

    # Group and reformat the data to split it by 'cardio'. Show the counts of each feature. You will have to rename one of the columns for the catplot to work correctly.
    # df_cat = df_cat.groupby('cardio').groups
    df_cat = df_cat.groupby(['cardio','variable','value'], as_index = False).size()
    # rename the column name in order to pass the tests...
    df_cat = df_cat.rename(columns={'size':'total'})

    # Draw the catplot with 'sns.catplot()'
    # Note: catplot doesn’t return a figure, it returns a FacetGrid object. You can add the '.fig' attribute, which is required to pass the tests
    fig = sns.catplot(x="variable", y='total', hue='value', kind='bar', col="cardio", data=df_cat).fig


    # Do not modify the next two lines
    fig.savefig('catplot.png')
    return fig


# Draw Heat Map
def draw_heat_map():
    # Clean the data
    df_heat = df[((df['ap_lo'] <= df['ap_hi'])) & (df['height'] >= (df['height'].quantile(0.025))) & (df['height'] <= (df['height'].quantile(0.975))) & (df['weight'] >= (df['weight'].quantile(0.025))) & (df['weight'] <= (df['weight'].quantile(0.975)))]

    # Calculate the correlation matrix
    corr = df_heat.corr()

    # Generate a mask for the upper triangle
    mask = np.zeros_like(corr)
    mask[np.triu_indices_from(mask)] = True

    # Set up the matplotlib figure
    fig, ax = plt.subplots(figsize=(8, 8))

    # Draw the heatmap with 'sns.heatmap()'
    ax = sns.heatmap(corr, mask=mask, annot=True, linewidths=.5, vmax=.3, center=0.09,square=True, cmap="YlGnBu", fmt=".1f")


    # Do not modify the next two lines
    fig.savefig('heatmap.png')
    return fig
