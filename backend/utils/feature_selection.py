import numpy as np
import pandas as pd
from sklearn.feature_selection import SelectFromModel
from sklearn.linear_model import Lasso
from sklearn.decomposition import PCA
from sklearn.feature_selection import mutual_info_regression

def lasso_feature_selection(X, y, alpha=0.01):
    """
    Perform feature selection using LASSO regression.
    Time Complexity: O(np) per iteration (n = samples, p = features)
    
    Args:
        X: Feature matrix
        y: Target variable
        alpha: Regularization strength
        
    Returns:
        Selected feature indices and feature selector
    """
    # Create and fit the LASSO model
    lasso = Lasso(alpha=alpha, random_state=42)
    
    # For survival data, use the time as target
    if hasattr(y, 'dtype') and y.dtype.names is not None and 'time' in y.dtype.names:
        target = y['time']
    else:
        target = y
    
    # Fit the model
    lasso.fit(X, target)
    
    # Create feature selector
    selector = SelectFromModel(lasso, prefit=True, threshold=1e-5)
    
    # Get selected feature indices
    selected_indices = selector.get_support(indices=True)
    
    return selected_indices, selector

def pca_dimensionality_reduction(X, n_components=0.95):
    """
    Perform dimensionality reduction using PCA.
    
    Args:
        X: Feature matrix
        n_components: Number of components or variance ratio to keep
        
    Returns:
        Transformed data and PCA object
    """
    # Create and fit PCA
    pca = PCA(n_components=n_components, random_state=42)
    X_transformed = pca.fit_transform(X)
    
    # Print explained variance
    explained_variance = pca.explained_variance_ratio_.sum()
    print(f"PCA: {pca.n_components_} components explain {explained_variance:.2%} of variance")
    
    return X_transformed, pca

def mutual_information_selection(X, y, k=10):
    """
    Select features based on mutual information.
    
    Args:
        X: Feature matrix
        y: Target variable
        k: Number of features to select
        
    Returns:
        Selected feature indices and scores
    """
    # For survival data, use the time as target
    if hasattr(y, 'dtype') and y.dtype.names is not None and 'time' in y.dtype.names:
        target = y['time']
    else:
        target = y
    
    # Calculate mutual information
    mi_scores = mutual_info_regression(X, target)
    
    # Get feature names if available
    if hasattr(X, 'columns'):
        feature_names = X.columns
    else:
        feature_names = [f"feature_{i}" for i in range(X.shape[1])]
    
    # Create DataFrame with scores
    mi_df = pd.DataFrame({
        'feature': feature_names,
        'mi_score': mi_scores
    })
    
    # Sort by score
    mi_df = mi_df.sort_values('mi_score', ascending=False)
    
    # Select top k features
    selected_features = mi_df.head(k)['feature'].values
    
    # Get indices of selected features
    if hasattr(X, 'columns'):
        selected_indices = [X.columns.get_loc(feature) for feature in selected_features]
    else:
        selected_indices = [int(feature.split('_')[1]) for feature in selected_features]
    
    return selected_indices, mi_df
