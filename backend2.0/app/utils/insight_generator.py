import pandas as pd
def generate_insights(df):

    insights = []

    insights.append(f"Dataset contains {len(df)} rows")

    numeric_cols = df.select_dtypes(include=['int64','float64']).columns.tolist()

    if numeric_cols:

        top_col = numeric_cols[0]

        insights.append(
            f"Highest {top_col} value is {df[top_col].max()}"
        )

        insights.append(
            f"Average {top_col} is {round(df[top_col].mean(),2)}"
        )

    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

    if categorical_cols:

        top_category = df[categorical_cols[0]].value_counts().idxmax()

        insights.append(
            f"Most frequent {categorical_cols[0]} is {top_category}"
        )

    return insights
