import pandas as pd
import numpy as np
import os

def process_csv_file(file_path):
    """
    Process a CSV file with patient data.
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        DataFrame with processed data
    """
    # Read CSV file
    df = pd.read_csv(file_path)
    
    # Check required columns
    required_columns = ['patient_id']
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
    
    # Basic data validation
    # Check for duplicate patient IDs
    if df['patient_id'].duplicated().any():
        print(f"Warning: Found {df['patient_id'].duplicated().sum()} duplicate patient IDs")
    
    # Check for missing values
    missing_values = df.isnull().sum()
    if missing_values.sum() > 0:
        print(f"Warning: Found {missing_values.sum()} missing values")
        print(missing_values[missing_values > 0])
    
    return df

def save_results(results, output_dir, filename=None):
    """
    Save prediction results to CSV file.
    
    Args:
        results: Dictionary with prediction results
        output_dir: Directory to save the results
        filename: Optional filename (default: results_TIMESTAMP.csv)
        
    Returns:
        Path to the saved file
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate filename if not provided
    if filename is None:
        timestamp = pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')
        filename = f"results_{timestamp}.csv"
    
    # Create DataFrame from results
    if 'patients' in results:
        # Batch results
        df = pd.DataFrame(results['patients'])
    else:
        # Single patient result
        df = pd.DataFrame([{
            'patientId': results['patientId'],
            'survivalProbability': results['survivalProbability'],
            'riskScore': results['riskScore'],
            'predictedSurvivalMonths': results['predictedSurvivalMonths']
        }])
    
    # Save to CSV
    output_path = os.path.join(output_dir, filename)
    df.to_csv(output_path, index=False)
    
    return output_path
