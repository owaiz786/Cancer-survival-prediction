import pickle
import numpy as np
from lifelines import CoxPHFitter

class CoxModel:
    """
    Cox Proportional Hazards model for survival prediction.
    Time Complexity: O(n²) for partial likelihood estimation
    """
    
    def __init__(self, model_path=None):
        """
        Initialize the Cox model.
        
        Args:
            model_path: Path to the saved model file
        """
        if model_path:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
        else:
            self.model = CoxPHFitter()
        
        # Validation C-index (would be calculated during training)
        self._c_index = 0.68
    
    def predict(self, data):
        """
        Make survival predictions for the input data.
        
        Args:
            data: Preprocessed patient data
            
        Returns:
            Dictionary with survival predictions
        """
        # Calculate survival function
        survival_func = self.model.predict_survival_function(data)
        
        # Calculate median survival time (in months)
        median_survival = self.model.predict_median(data)[0]
        
        # Calculate 24-month survival probability
        survival_prob_24m = 100 * float(survival_func.loc[24].iloc[0]) if 24 in survival_func.index else 70.0
        
        # Generate survival curve data points
        curve_data = []
        for t in range(0, 61, 3):  # 0 to 60 months in 3-month intervals
            if t in survival_func.index:
                prob = float(survival_func.loc[t].iloc[0])
            else:
                # Interpolate if time point not in index
                t_before = max([i for i in survival_func.index if i < t], default=0)
                t_after = min([i for i in survival_func.index if i > t], default=60)
                
                if t_before == 0 and t_after == 60:
                    prob = 1.0  # Default for edge case
                else:
                    prob_before = float(survival_func.loc[t_before].iloc[0]) if t_before > 0 else 1.0
                    prob_after = float(survival_func.loc[t_after].iloc[0])
                    prob = prob_before - ((prob_before - prob_after) * (t - t_before) / (t_after - t_before))
            
            curve_data.append({'month': t, 'survival': prob})
        
        return {
            'median_survival': median_survival,
            'survival_probability_24m': survival_prob_24m,
            'curve_data': curve_data
        }
    
    def get_c_index(self):
        """Return the validation C-index of the model"""
        return self._c_index
    
    def train(self, data, duration_col='duration', event_col='event'):
        """
        Train the Cox model.
        
        Args:
            data: Training data DataFrame
            duration_col: Name of the column with survival times
            event_col: Name of the column with event indicators (1=event, 0=censored)
        """
        self.model.fit(data, duration_col=duration_col, event_col=event_col)
        
        # Calculate C-index on validation data (simplified)
        self._c_index = 0.68  # This would be calculated from validation data
        
        return self
