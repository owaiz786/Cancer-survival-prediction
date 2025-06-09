import numpy as np
from lifelines.utils import concordance_index
from sklearn.metrics import brier_score_loss
from scipy.stats import logrank_test

def calculate_c_index(y_true, y_pred):
    """
    Calculate Harrell's Concordance Index.
    
    Args:
        y_true: Structured array with 'event' and 'time' fields
        y_pred: Predicted risk scores
        
    Returns:
        C-index value
    """
    return concordance_index(y_true['time'], -y_pred, y_true['event'])

def calculate_brier_score(y_true, survival_probs, times):
    """
    Calculate Brier Score at specified time points.
    
    Args:
        y_true: Structured array with 'event' and 'time' fields
        survival_probs: Predicted survival probabilities at each time point
        times: Time points at which to evaluate
        
    Returns:
        Dictionary with Brier scores at each time point
    """
    brier_scores = {}
    
    for t in times:
        # Create binary outcome: 1 if event occurred before time t, 0 otherwise
        y_binary = np.zeros(len(y_true))
        for i, (event, time) in enumerate(zip(y_true['event'], y_true['time'])):
            if event and time <= t:
                y_binary[i] = 1
        
        # Get survival probability at time t
        s_t = np.array([sp[t] if t in sp else 0 for sp in survival_probs])
        
        # Calculate Brier score
        brier_scores[t] = brier_score_loss(y_binary, 1 - s_t)
    
    return brier_scores

def calculate_log_rank(groups, times, events):
    """
    Perform Log-rank test to compare survival curves.
    
    Args:
        groups: Group assignments (e.g., high risk vs. low risk)
        times: Survival times
        events: Event indicators
        
    Returns:
        Dictionary with test statistic and p-value
    """
    # Split data by groups
    unique_groups = np.unique(groups)
    group_times = {g: [] for g in unique_groups}
    group_events = {g: [] for g in unique_groups}
    
    for g, t, e in zip(groups, times, events):
        group_times[g].append(t)
        group_events[g].append(e)
    
    # Convert to arrays
    times1 = np.array(group_times[unique_groups[0]])
    times2 = np.array(group_times[unique_groups[1]])
    events1 = np.array(group_events[unique_groups[0]])
    events2 = np.array(group_events[unique_groups[1]])
    
    # Perform log-rank test
    result = logrank_test(times1, times2, events1, events2)
    
    return {
        'statistic': result.test_statistic,
        'p_value': result.p_value
    }
