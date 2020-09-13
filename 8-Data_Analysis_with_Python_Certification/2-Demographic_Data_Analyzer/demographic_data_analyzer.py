import pandas as pd


def calculate_demographic_data(print_data=True):
    # Read data from file
    df = pd.read_csv('./adult.data.csv')

    # How many of each race are represented in this dataset? This should be a Pandas series with race names as the index labels.
    race_count = df['race'].value_counts()

    # What is the average age of men?
    average_age_men = df.loc[df['sex']=='Male', 'age'].mean().round(1)

    # What is the percentage of people who have a Bachelor's degree?
    percentage_bachelors = round(len(df.loc[df['education']=='Bachelors']) * 100 / df.shape[0], 1)

    # What percentage of people with advanced education (`Bachelors`, `Masters`, or `Doctorate`) make more than 50K?
    # What percentage of people without advanced education make more than 50K?

    # with and without `Bachelors`, `Masters`, or `Doctorate`
    higher_education = len(df[(((df['education']=='Bachelors') | (df['education']=='Masters') | (df['education']=='Doctorate')))])
    lower_education = len(df.loc[~((df['education']=='Bachelors') | (df['education']=='Masters') | (df['education']=='Doctorate'))])

    # percentage with salary >50K
    highEd_50k = len(df.loc[(((df['education']=='Bachelors') | (df['education']=='Masters') | (df['education']=='Doctorate'))) & (df['salary']=='>50K')])
    lowEd_50k = len(df.loc[~((df['education']=='Bachelors') | (df['education']=='Masters') | (df['education']=='Doctorate')) & (df['salary']=='>50K')])
    higher_education_rich = round(highEd_50k * 100 / higher_education, 1)
    lower_education_rich = round(lowEd_50k * 100 / lower_education, 1)

    # What is the minimum number of hours a person works per week (hours-per-week feature)?
    min_work_hours = df['hours-per-week'].min()

    # What percentage of the people who work the minimum number of hours per week have a salary of >50K?
    num_min_workers = len(df.loc[df['hours-per-week']==min_work_hours])

    rich_percentage = 100 * len(df.loc[(df['hours-per-week']==min_work_hours) & (df['salary']=='>50K')]) / num_min_workers

    # What country has the highest percentage of people that earn >50K?
    ppl_per_country = df['native-country'].value_counts()
    rich_per_country = df.loc[df['salary'] == '>50K', 'native-country'].value_counts()
    newdf = pd.DataFrame()
    newdf['ppl'] = ppl_per_country
    newdf['rich'] = rich_per_country
    newdf['proportion'] = newdf['rich'] / newdf['ppl']

    highest_earning_country = newdf[newdf['proportion'] == newdf['proportion'].max()].index[0]
    highest_earning_country_percentage = round(newdf[newdf['proportion'] == newdf['proportion'].max()].values[0][2]*100, 1)

    # Identify the most popular occupation for those who earn >50K in India.
    top_IN_occupation = df.loc[(df['native-country'] == 'India') & (df['salary'] == '>50K'), 'occupation'].value_counts().idxmax()

    # DO NOT MODIFY BELOW THIS LINE

    if print_data:
        print("Number of each race:\n", race_count) 
        print("Average age of men:", average_age_men)
        print(f"Percentage with Bachelors degrees: {percentage_bachelors}%")
        print(f"Percentage with higher education that earn >50K: {higher_education_rich}%")
        print(f"Percentage without higher education that earn >50K: {lower_education_rich}%")
        print(f"Min work time: {min_work_hours} hours/week")
        print(f"Percentage of rich among those who work fewest hours: {rich_percentage}%")
        print("Country with highest percentage of rich:", highest_earning_country)
        print(f"Highest percentage of rich people in country: {highest_earning_country_percentage}%")
        print("Top occupations in India:", top_IN_occupation)

    return {
        'race_count': race_count,
        'average_age_men': average_age_men,
        'percentage_bachelors': percentage_bachelors,
        'higher_education_rich': higher_education_rich,
        'lower_education_rich': lower_education_rich,
        'min_work_hours': min_work_hours,
        'rich_percentage': rich_percentage,
        'highest_earning_country': highest_earning_country,
        'highest_earning_country_percentage':
        highest_earning_country_percentage,
        'top_IN_occupation': top_IN_occupation
    }
