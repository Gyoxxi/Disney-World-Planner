import csv
import os

def count_rows(csv_file):
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        row_count = sum(1 for row in reader)
    return row_count

def count_rows_in_folder(folder_path, count):
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.csv') and file_name.startswith('Ride'):
            file_path = os.path.join(folder_path, file_name)
            row_count = count_rows(file_path)
            print(f"File: {file_name}, Rows: {row_count}")
            count += row_count

    print(f"Total: {count}")

if __name__ == "__main__":
    folder_path = '.' 
    count = 0
    count_rows_in_folder(folder_path, count)
