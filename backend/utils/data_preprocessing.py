import pandas as pd
import numpy as np

def preprocess_input(data, preprocessor=None):
    """
    Preprocess input data for model prediction.
    
    Args:
        data: Dictionary or DataFrame with patient data
        preprocessor: Fitted sklearn preprocessor
        
    Returns:
        Preprocessed data ready for model input
    """
    # Convert dictionary to DataFrame if needed
    if isinstance(data, dict):
        data = pd.DataFrame([data])
    
    # Handle missing values
    data = handle_missing_values(data)
    
    # Convert categorical features
    data = encode_categorical_features(data)
    
    # Apply feature scaling if preprocessor is provided
    if preprocessor is not None:
        numeric_cols = data.select_dtypes(include=['float64', 'int64']).columns
        data[numeric_cols] = preprocessor.transform(data[numeric_cols])
    
    return data

def handle_missing_values(df):
    """
    Handle missing values in the input data.
    
    Args:
        df: Input DataFrame
        
    Returns:
        DataFrame with handled missing values
    """
    # Make a copy to avoid modifying the original
    df = df.copy()
    
    # Fill missing numerical values with median
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    for col in numeric_cols:
        if df[col].isna().any():
            # Use median as a simple imputation strategy
            median_value = df[col].median()
            if pd.isna(median_value):  # If all values are NA
                median_value = 0
            df[col] = df[col].fillna(median_value)
    
    # Fill missing categorical values with mode
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns
    for col in categorical_cols:
        if df[col].isna().any():
            # Use most frequent value
            mode_value = df[col].mode()[0] if not df[col].mode().empty else "unknown"
            df[col] = df[col].fillna(mode_value)
    
    return df

def encode_categorical_features(df):
    """
    Encode categorical features in the input data.
    
    Args:
        df: Input DataFrame
        
    Returns:
        DataFrame with encoded categorical features
    """
    # Make a copy to avoid modifying the original
    df = df.copy()
    
    # Map common categorical variables
    gender_map = {'female': 0, 'male': 1}
    if 'gender' in df.columns:
        df['gender'] = df['gender'].map(gender_map).fillna(0)
    
    status_map = {'negative': 0, 'positive': 1}
    for col in ['erStatus', 'prStatus', 'her2Status']:
        if col in df.columns:
            df[col] = df[col].map(status_map).fillna(0)
    
    stage_map = {'I': 1, 'II': 2, 'III': 3, 'IV': 4}
    if 'tumorStage' in df.columns:
        df['tumorStage'] = df['tumorStage'].map(stage_map).fillna(2)
    
    treatment_map = {
        'none': 0,
        'surgery': 1,
        'chemotherapy': 2,
        'radiation': 3,
        'combination': 4
    }
    if 'treatmentHistory' in df.columns:
        df['treatmentHistory'] = df['treatmentHistory'].map(treatment_map).fillna(0)
    
    # Convert any remaining object columns to numeric if possible
    for col in df.select_dtypes(include=['object']).columns:
        try:
            df[col] = pd.to_numeric(df[col])
        except:
            # If conversion fails, use one-hot encoding
            dummies = pd.get_dummies(df[col], prefix=col, drop_first=True)
            df = pd.concat([df, dummies], axis=1)
            df = df.drop(col, axis=1)
    
    return df
