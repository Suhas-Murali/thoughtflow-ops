import openpyxl
from test_prompt import analyze_error

def read_error_logs(file_path, limit=5):
    workbook = openpyxl.load_workbook(file_path)
    sheet = workbook.active

    # Find the column index for "Error_Log" from the header row
    headers = [cell.value for cell in sheet[1]]
    error_log_col = headers.index("Error_Log")

    logs = []
    for row in sheet.iter_rows(min_row=2, max_row=limit + 1, values_only=True):
        logs.append(row[error_log_col])
    return logs

def test_file(file_path, limit=5):
    print(f"\n{'='*70}")
    print(f"TESTING: {file_path}")
    print('='*70)

    logs = read_error_logs(file_path, limit=limit)
    for log in logs:
        result = analyze_error(str(log))
        print("INPUT: ", str(log)[:80].replace("\n", " "), "...")
        print("OUTPUT:", result)
        print("-" * 60)

if __name__ == "__main__":
    test_file("../sample-data/Corrupted_Edge_Cases.xlsx", limit=5)
    test_file("../sample-data/Raw_Noisy_Logs.xlsx", limit=5)