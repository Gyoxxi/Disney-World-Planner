import glob
import pandas as pd
import os

def get_df(filepath):
    df = pd.read_csv(filepath, engine='python',
                     header=0, dtype={'Flight Number': 'Int64'},
                     skipfooter=1)

    # ['Carrier Code', 'Date (MM/DD/YYYY)', 'Flight Number', 'Tail Number',
    # 'Origin Airport', 'Scheduled Arrival Time', 'Actual Arrival Time',
    # 'Scheduled Elapsed Time (Minutes)', 'Actual Elapsed Time (Minutes)',
    # 'Arrival Delay (Minutes)', 'Wheels-on Time', 'Taxi-In time (Minutes)',
    # 'Delay Carrier (Minutes)', 'Delay Weather (Minutes)', 'Delay National
    # Aviation System (Minutes)', 'Delay Security (Minutes)', 'Delay Late
    # Aircraft Arrival (Minutes)']

    selected_columns = ['Carrier Code', 'Date (MM/DD/YYYY)', 'Flight Number',
                        'Origin Airport', 'Arrival Delay (Minutes)',
                        'Scheduled Arrival Time']
    df2 = df[selected_columns]

    missing_df2 = df2.isin([" ?"])
    missing_df2 = missing_df2.any(axis=1)
    df2 = df2.loc[(~missing_df2).values, :]

    df3 = df2.rename(
        columns={'Date (MM/DD/YYYY)': 'Date',
                 'Arrival Delay (Minutes)': 'ArrivalDelay',
                 'Scheduled Arrival Time': 'ScheduledArrivalTime',
                 'Origin Airport': 'OriginAirport'
                 })

    df3 = df3.drop(columns=['Carrier Code', 'Flight Number'])

    df3['FlightNumber'] = (df2['Carrier Code'].astype(str) +
                           df2['Flight Number'].astype(str))
    df3['Date'] = pd.to_datetime(df3['Date'], format='%m/%d/%y').dt.strftime(
        '%Y-%m-%d')

    columns = df3.columns.tolist()

    new_order = columns[:1] + [columns[-1]] + columns[1:-1]
    df3 = df3[new_order]

    return df3


def get_combined_csv(folder_path):
    file_names = [f for f in os.listdir(folder_path) if
                  os.path.isfile(os.path.join(folder_path, f))]
    files = [f for f in file_names if f.endswith('.csv')]
    dfs = []
    if len(files) == 0:
        return
    for fp in files:
        df = get_df(folder_path + '/' + fp)
        dfs.append(df)
    combined_df = pd.concat([df.iloc[:-1] for df in dfs], ignore_index=True)

    output_fp = 'flights_combined.csv'

    combined_df.to_csv(output_fp, index=False)


if __name__ == '__main__':
    get_combined_csv(os.getcwd()+'/raw')
