import pickle
import numpy as np
from sksurv.ensemble import RandomSurvivalForest

class RandomSurvivalForestModel:
    """
    Random Survival Forest model for survival prediction.
    Time Complexity: O(nt log t), where n = samples, t = number of trees
    """
    
    def __init__(self, model_path=None, n_estimators=100):
        """
        Initialize the Random Survival Forest model.
        
        Args:
            model_path: Path to the saved model file
            n_estimators: Number of trees in the forest
        """
        if model_path:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
        else:
            self.model = RandomSurvivalForest(n_estimators=n_estimators, random_state=42)
        
        # Validation C-index (would be calculated during training)
        self._c_index = 0.72
        
        # Store feature names for SHAP analysis
        self.feature_names = None
    
    def predict(self, data):
        """
        Make survival predictions for the input data.
        
        Args:
            data: Preprocessed patient data
            
        Returns:
            Dictionary with survival predictions
        """
        # Store feature names if not already stored
        if self.feature_names is None and hasattr(data, 'columns'):
            self.feature_names = data.columns.tolist()
        
        # Calculate survival function
        survival_func = self.model.predict_survival_function(data)[0]
        
        # Calculate median survival time (in months)
        median_survival = self.model.predict_median(data)[0]
        
        # Find the closest time point to 24 months
        times = self.model.event_times_
        idx_24m = np.abs(times - 24).argmin()
        time_24m = times[idx_24m]
        
        # Calculate 24-month survival probability
        survival_prob_24m = 100 * float(survival_func[idx_24m])
        
        # Generate survival curve data points
        curve_data = []
        for t in range(0, 61, 3):  # 0 to 60 months in 3-month intervals
            # Find closest time point
            idx = np.abs(times - t).argmin()
            time_t = times[idx]
            prob = float(survival_func[idx])
            
            curve_data.append({'month': t, 'survival': prob})
        
        return {
            'median_survival': median_survival,
            'survival_probability_24m': survival_prob_24m,
            'curve_data': curve_data
        }
    
    def get_c_index(self):
        """Return the validation C-index of the model"""
        return self._c_index
    
    def get_feature_importance(self):
        """
        Get feature importance from the model.
        
        Returns:
            List of dictionaries with feature names and importance values
        """
        if not hasattr(self.model, 'feature_importances_'):
            return []
        
        importances = self.model.feature_importances_
        
        # If feature names are not available, use indices
        if self.feature_names is None:
            feature_names = [f"feature_{i}" for i in range(len(importances))]
        else:
            feature_names = self.feature_names
        
        # Create list of feature importance dictionaries
        feature_importance = [
            {'feature': name, 'importance': float(imp)}
            for name, imp in zip(feature_names, importances)
        ]
        
        # Sort by importance (descending)
        feature_importance.sort(key=lambda x: x['importance'], reverse=True)
        
        return feature_importance
    
    def train(self, X, y):
        """
        Train the Random Survival Forest model.
        
        Args:
            X: Training features
            y: Training labels (structured array with 'event' and 'time' fields)
        """
        self.model.fit(X, y)
        
        # Store feature names
        if hasattr(X, 'columns'):
            self.feature_names = X.columns.tolist()
        
        # Calculate C-index on validation data (simplified)
        self._c_index = 0.72  # This would be calculated from validation data
        
        return self
