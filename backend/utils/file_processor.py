import pandas as pd
import numpy as np
import os
import io # Required to read string content as a file

# MODIFIED: The function now takes file content and filename, not a path.
def process_uploaded_file(file_content, filename, id_column='patient_id'):
    """
    Process patient data from an uploaded file's content.
    It can handle both comma-separated (CSV) and tab-separated (TSV) files.
    
    Args:
        file_content (str): The text content of the uploaded file.
        filename (str): The original name of the file (e.g., "clinical_data.tsv").
                        Used to infer the separator.
        id_column (str): The name of the column containing the patient identifier.
                         Defaults to 'patient_id'. For TCGA, you might use 'bcr_patient_barcode'.
        
    Returns:
        DataFrame with processed data
    """
    # --- MODIFICATION: Determine separator based on filename ---
    if filename.lower().endswith(('.tsv', '.txt')):
        separator = '\t'
        print("Detected tab-separated file (TSV).")
    else:
        separator = ','
        print("Assuming comma-separated file (CSV).")

    # --- MODIFICATION: Read from string content instead of a file path ---
    # Use io.StringIO to treat the string `file_content` as a file
    file_stream = io.StringIO(file_content)
    df = pd.read_csv(file_stream, sep=separator)
    
    # MODIFIED: Check for the user-specified ID column
    required_columns = [id_column]
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        raise ValueError(f"Missing required ID column: '{id_column}'")
    
    # Basic data validation (now uses the flexible id_column)
    # Check for duplicate patient IDs
    if df[id_column].duplicated().any():
        print(f"Warning: Found {df[id_column].duplicated().sum()} duplicate patient IDs in column '{id_column}'")
    
    # Check for missing values
    missing_values = df.isnull().sum()
    if missing_values.sum() > 0:
        print(f"Warning: Found {missing_values.sum()} missing values")
        print(missing_values[missing_values > 0])
    
    return df

# NEW FUNCTION: Replaces `save_results` to be compatible with the environment
def generate_results_csv(results):
    """
    Generates a CSV-formatted string from prediction results.
    
    Args:
        results: Dictionary with prediction results for one or more patients.
        
    Returns:
        A string containing the results in CSV format.
    """
    # Create DataFrame from results
    if 'patients' in results:
        # Batch results
        df = pd.DataFrame(results['patients'])
    else:
        # Single patient result
        df = pd.DataFrame([{
            'patientId': results.get('patientId'),
            'survivalProbability': results.get('survivalProbability'),
            'riskScore': results.get('riskScore'),
            'predictedSurvivalMonths': results.get('predictedSurvivalMonths')
        }])
    
    # --- MODIFICATION: Convert DataFrame to a CSV string instead of saving to a file ---
    return df.to_csv(index=False)