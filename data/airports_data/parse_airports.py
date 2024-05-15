import glob
import pandas as pd
import os


def get_df(filepath):
    df = pd.read_csv(filepath, engine='python',
                     header=0)
    df_filtered = df.dropna(subset=['iata_code'])
    df_filtered.to_csv('airports.csv', index=False)


def remove_dup():
    # Read the CSV file into a DataFrame
    df = pd.read_csv('airports.csv')

    # Drop rows with duplicated iata_code values
    df_no_duplicates = df.drop_duplicates(subset='iata_code', keep='first')

    # Keep only specific columns
    columns_to_keep = ['name', 'iata_code', 'iso_region', 'type']
    df_filtered = df_no_duplicates[columns_to_keep]

    # Write the result to a new CSV file
    df_filtered.to_csv('airports_nodup.csv', index=False)


if __name__ == '__main__':
    remove_dup()
