
# 📊 User Activity Analysis – Python

This script analyzes user activity data from a CSV file. It identifies the top users by action count and detects suspicious repeated actions within a short time window efficiently using chunked CSV reading.

---

## 🛠 Prerequisites

- Python 3.6+ installed  
- CSV file named `activity.csv` (or update filename in the script) containing user activity with columns:  
  `timestamp` (ISO 8601 format), `user_id`, and `action`

---

## 🚀 How to Run

1. **Save** the provided Python code in a file, e.g., `activity_analysis.py`.

2. **Place** your `activity.csv` file in the same directory as the script (or adjust the path in the code).

3. Open a terminal or command prompt and navigate to the script’s folder.

4. Run the script with:

```bash
python activity_analysis.py
