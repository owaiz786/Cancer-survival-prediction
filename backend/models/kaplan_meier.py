import numpy as np
import pandas as pd
from lifelines import KaplanMeierFitter

class KaplanMeierModel:
    """
    Kaplan-Meier estimator for survival analysis.
    Time Complexity: O(n log n) for sorting and estimation
    """
    
    def __init__(self):
        """Initialize the Kaplan-Meier estimator."""
        self.model = KaplanMeierFitter()
        self.is_fitted = False
        self.survival_function = None
        self.confidence_intervals = None
        
    def fit(self, durations, event_observed, label=None):
        """
        Fit the Kaplan-Meier estimator.
        
        Args:
            durations: Array of survival times
            event_observed: Array of event indicators (1=event, 0=censored)
            label: Optional label for the survival curve
        """
        self.model.fit(durations, event_observed, label=label)
        self.is_fitted = True
        
        # Store survival function and confidence intervals
        self.survival_function = self.model.survival_function_
        self.confidence_intervals = self.model.confidence_interval_
        
        return self
    
    def predict_survival_function(self, times=None):
        """
        Predict survival probabilities at specified times.
        
        Args:
            times: Array of time points for prediction
            
        Returns:
            Dictionary with survival probabilities and confidence intervals
        """
        if not self.is_fitted:
            raise ValueError("Model must be fitted before prediction")
        
        if times is None:
            times = np.arange(0, 61, 3)  # 0 to 60 months in 3-month intervals
        
        # Get survival probabilities at specified times
        survival_probs = []
        upper_ci = []
        lower_ci = []
        
        for t in times:
            # Find the closest time point in the survival function
            if t in self.survival_function.index:
                prob = float(self.survival_function.iloc[self.survival_function.index.get_loc(t), 0])
                upper = float(self.confidence_intervals.iloc[self.confidence_intervals.index.get_loc(t), 1])
                lower = float(self.confidence_intervals.iloc[self.confidence_intervals.index.get_loc(t), 0])
            else:
                # Interpolate if exact time not available
                available_times = self.survival_function.index
                if t < available_times.min():
                    prob = 1.0
                    upper = 1.0
                    lower = 1.0
                elif t > available_times.max():
                    prob = float(self.survival_function.iloc[-1, 0])
                    upper = float(self.confidence_intervals.iloc[-1, 1])
                    lower = float(self.confidence_intervals.iloc[-1, 0])
                else:
                    # Linear interpolation
                    idx = available_times.searchsorted(t)
                    t1, t2 = available_times[idx-1], available_times[idx]
                    
                    prob1 = float(self.survival_function.iloc[idx-1, 0])
                    prob2 = float(self.survival_function.iloc[idx, 0])
                    prob = prob1 + (prob2 - prob1) * (t - t1) / (t2 - t1)
                    
                    upper1 = float(self.confidence_intervals.iloc[idx-1, 1])
                    upper2 = float(self.confidence_intervals.iloc[idx, 1])
                    upper = upper1 + (upper2 - upper1) * (t - t1) / (t2 - t1)
                    
                    lower1 = float(self.confidence_intervals.iloc[idx-1, 0])
                    lower2 = float(self.confidence_intervals.iloc[idx, 0])
                    lower = lower1 + (lower2 - lower1) * (t - t1) / (t2 - t1)
            
            survival_probs.append(prob)
            upper_ci.append(upper)
            lower_ci.append(lower)
        
        return {
            'times': times,
            'survival_probabilities': survival_probs,
            'upper_confidence': upper_ci,
            'lower_confidence': lower_ci
        }
    
    def get_median_survival(self):
        """
        Get the median survival time.
        
        Returns:
            Median survival time in months
        """
        if not self.is_fitted:
            raise ValueError("Model must be fitted before getting median survival")
        
        return self.model.median_survival_time_
    
    def get_survival_at_time(self, time):
        """
        Get survival probability at a specific time.
        
        Args:
            time: Time point for survival probability
            
        Returns:
            Survival probability at the specified time
        """
        if not self.is_fitted:
            raise ValueError("Model must be fitted before prediction")
        
        return self.model.survival_function_at_times(time).iloc[0]
    
    @staticmethod
    def compare_groups(group1_durations, group1_events, group2_durations, group2_events, 
                      group1_label="Group 1", group2_label="Group 2"):
        """
        Compare survival curves between two groups using Kaplan-Meier estimation.
        
        Args:
            group1_durations: Survival times for group 1
            group1_events: Event indicators for group 1
            group2_durations: Survival times for group 2
            group2_events: Event indicators for group 2
            group1_label: Label for group 1
            group2_label: Label for group 2
            
        Returns:
            Dictionary with fitted models and comparison data
        """
        # Fit Kaplan-Meier for each group
        km1 = KaplanMeierModel()
        km1.fit(group1_durations, group1_events, label=group1_label)
        
        km2 = KaplanMeierModel()
        km2.fit(group2_durations, group2_events, label=group2_label)
        
        # Generate comparison data
        times = np.arange(0, 61, 3)
        group1_data = km1.predict_survival_function(times)
        group2_data = km2.predict_survival_function(times)
        
        comparison_data = []
        for i, t in enumerate(times):
            comparison_data.append({
                'month': t,
                f'{group1_label.lower().replace(" ", "_")}': group1_data['survival_probabilities'][i],
                f'{group2_label.lower().replace(" ", "_")}': group2_data['survival_probabilities'][i],
                f'{group1_label.lower().replace(" ", "_")}_upper': group1_data['upper_confidence'][i],
                f'{group1_label.lower().replace(" ", "_")}_lower': group1_data['lower_confidence'][i],
                f'{group2_label.lower().replace(" ", "_")}_upper': group2_data['upper_confidence'][i],
                f'{group2_label.lower().replace(" ", "_")}_lower': group2_data['lower_confidence'][i],
            })
        
        return {
            'group1_model': km1,
            'group2_model': km2,
            'comparison_data': comparison_data,
            'group1_median': km1.get_median_survival(),
            'group2_median': km2.get_median_survival()
        }
    
    def plot_survival_curve(self, title="Kaplan-Meier Survival Curve"):
        """
        Plot the survival curve (for use in Jupyter notebooks or standalone scripts).
        
        Args:
            title: Title for the plot
        """
        if not self.is_fitted:
            raise ValueError("Model must be fitted before plotting")
        
        import matplotlib.pyplot as plt
        
        plt.figure(figsize=(10, 6))
        self.model.plot_survival_function(title=title)
        plt.xlabel('Time (months)')
        plt.ylabel('Survival Probability')
        plt.grid(True, alpha=0.3)
        plt.show()
