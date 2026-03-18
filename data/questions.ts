// ══════════════════════════════════════════════════════════════
// QUESTION BANK
// Add new levels by appending to LEVEL_QUESTION_BANK.
// Each level: { level, label, asteroidSpeed, spawnInterval, questions[] }
// ══════════════════════════════════════════════════════════════

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // 0-indexed
}

export interface LevelConfig {
  level: number;
  label: string;
  asteroidSpeed: number; // px per frame at 60fps
  spawnInterval: number; // ms between spawns
  questions: Question[];
}

export const LEVEL_QUESTION_BANK: LevelConfig[] = [
  // ─────────────────────────────────────────────
  // LEVEL 1 — Data Basics
  // ─────────────────────────────────────────────
  {
    level: 1,
    label: "DATA BASICS",
    asteroidSpeed: 0.7,
    spawnInterval: 3800,
    questions: [
      {
        id: 101,
        question: "What does CSV stand for?",
        options: [
          "Computer Sorted Values",
          "Comma Separated Values",
          "Column Storage Variables",
          "Control System Vector",
        ],
        answer: 1,
      },

      {
        id: 102,
        question: "Which Python library is mainly used for data manipulation?",
        options: ["Django", "Flask", "Pandas", "Requests"],
        answer: 2,
      },

      {
        id: 103,
        question: "What is a Pandas DataFrame?",
        options: [
          "A database engine",
          "A 2-D labeled data structure",
          "A chart type",
          "A machine learning algorithm",
        ],
        answer: 1,
      },

      {
        id: 104,
        question: "Which format stores structured data using key-value pairs?",
        options: ["TXT", "JSON", "CSV", "PDF"],
        answer: 1,
      },

      {
        id: 105,
        question: "What does df.head() display?",
        options: [
          "First rows of dataframe",
          "Column names",
          "Data types",
          "Last rows",
        ],
        answer: 0,
      },

      {
        id: 106,
        question: "What is a null value in datasets?",
        options: [
          "Zero value",
          "A missing value",
          "Negative number",
          "Text value",
        ],
        answer: 1,
      },

      {
        id: 107,
        question: "Which function loads CSV files in pandas?",
        options: [
          "pd.read_csv()",
          "pd.load_csv()",
          "pd.open_csv()",
          "pd.import_csv()",
        ],
        answer: 0,
      },

      {
        id: 108,
        question: "What does df.shape return?",
        options: [
          "Data type info",
          "Chart of dataset",
          "(rows, columns)",
          "Column values",
        ],
        answer: 2,
      },

      {
        id: 109,
        question: "Which datatype represents True or False?",
        options: ["Boolean", "Float", "Integer", "String"],
        answer: 0,
      },

      {
        id: 110,
        question: "What does 'import pandas as pd' do?",
        options: [
          "Creates dataframe",
          "Imports pandas using alias pd",
          "Installs pandas",
          "Reads CSV file",
        ],
        answer: 1,
      },

      {
        id: 111,
        question: "Which library is used for numerical computing in Python?",
        options: ["NumPy", "Flask", "Django", "FastAPI"],
        answer: 0,
      },

      {
        id: 112,
        question: "Which symbol usually separates values in CSV?",
        options: ["Comma", "Semicolon", "Slash", "Colon"],
        answer: 0,
      },

      {
        id: 113,
        question: "What does df.tail() return?",
        options: [
          "Random rows",
          "Last rows of dataset",
          "First rows",
          "Column types",
        ],
        answer: 1,
      },

      {
        id: 114,
        question: "Which datatype stores decimal numbers?",
        options: ["Integer", "Float", "Boolean", "String"],
        answer: 1,
      },

      {
        id: 115,
        question: "Which attribute lists dataframe columns?",
        options: ["df.columns", "df.names", "df.header", "df.keys"],
        answer: 0,
      },

      {
        id: 116,
        question: "Which datatype stores text values?",
        options: ["String", "Boolean", "Integer", "Float"],
        answer: 0,
      },

      {
        id: 117,
        question: "Which function shows dataframe summary statistics?",
        options: ["df.summary()", "df.describe()", "df.info()", "df.stats()"],
        answer: 1,
      },

      {
        id: 118,
        question: "Which function removes rows with missing values?",
        options: ["remove_null()", "dropna()", "delete_missing()", "clean()"],
        answer: 1,
      },

      {
        id: 119,
        question: "Which function replaces missing values?",
        options: ["fillna()", "replaceNull()", "updateNull()", "insertna()"],
        answer: 0,
      },

      {
        id: 120,
        question: "Which file type stores tabular data?",
        options: ["CSV", "MP4", "PNG", "HTML"],
        answer: 0,
      },

      {
        id: 121,
        question: "Which function shows dataframe information?",
        options: ["df.info()", "df.details()", "df.describe()", "df.columns"],
        answer: 0,
      },

      {
        id: 122,
        question: "Which Python keyword imports modules?",
        options: ["import", "require", "include", "using"],
        answer: 0,
      },

      {
        id: 123,
        question: "What does df.columns return?",
        options: ["Row values", "Column names", "Data types", "Dataset size"],
        answer: 1,
      },

      {
        id: 124,
        question: "Which datatype stores whole numbers?",
        options: ["Float", "Integer", "String", "Boolean"],
        answer: 1,
      },

      {
        id: 125,
        question: "Which library is used for data analysis in Python?",
        options: ["Pandas", "TensorFlow", "PyTorch", "Flask"],
        answer: 0,
      },

      {
        id: 126,
        question: "What does df.size return?",
        options: [
          "Total elements in dataframe",
          "Column count",
          "Row count",
          "Data type",
        ],
        answer: 0,
      },

      {
        id: 127,
        question: "Which pandas function sorts values?",
        options: ["sort_values()", "order_values()", "arrange()", "sort_df()"],
        answer: 0,
      },

      {
        id: 128,
        question: "Which method converts dataframe to CSV?",
        options: ["to_csv()", "export_csv()", "save_csv()", "write_csv()"],
        answer: 0,
      },

      {
        id: 129,
        question: "Which pandas function selects rows by label?",
        options: ["loc[]", "iloc[]", "select[]", "pick[]"],
        answer: 0,
      },

      {
        id: 130,
        question: "Which function selects rows by index position?",
        options: ["iloc[]", "loc[]", "rowselect()", "df.pick()"],
        answer: 0,
      },

      {
        id: 131,
        question: "Which data structure stores ordered elements?",
        options: ["List", "Dictionary", "Set", "Tuple"],
        answer: 0,
      },

      {
        id: 132,
        question: "Which structure stores key-value pairs in Python?",
        options: ["Dictionary", "List", "Tuple", "Array"],
        answer: 0,
      },

      {
        id: 133,
        question: "Which keyword defines a function?",
        options: ["def", "func", "define", "method"],
        answer: 0,
      },

      {
        id: 134,
        question: "Which operator checks equality?",
        options: ["==", "=", "!=", "<>"],
        answer: 0,
      },

      {
        id: 135,
        question: "Which Python structure repeats code?",
        options: ["Loop", "Condition", "Variable", "Function"],
        answer: 0,
      },

      {
        id: 136,
        question: "Which loop iterates over sequences?",
        options: ["for loop", "while loop", "if statement", "switch"],
        answer: 0,
      },

      {
        id: 137,
        question: "Which keyword creates a conditional block?",
        options: ["if", "for", "loop", "case"],
        answer: 0,
      },

      {
        id: 138,
        question: "Which keyword handles exceptions?",
        options: ["try", "handle", "check", "fix"],
        answer: 0,
      },

      {
        id: 139,
        question: "Which keyword defines a class?",
        options: ["class", "object", "struct", "model"],
        answer: 0,
      },

      {
        id: 140,
        question: "Which pandas method removes duplicates?",
        options: [
          "drop_duplicates()",
          "remove_duplicates()",
          "delete_repeat()",
          "clean_duplicates()",
        ],
        answer: 0,
      },

      {
        id: 141,
        question: "Which function counts rows?",
        options: ["len(df)", "count_rows()", "df.rows()", "df.length"],
        answer: 0,
      },

      {
        id: 142,
        question: "Which library creates visualisations?",
        options: ["Matplotlib", "NumPy", "Requests", "Flask"],
        answer: 0,
      },

      {
        id: 143,
        question: "Which data structure is immutable?",
        options: ["Tuple", "List", "Dictionary", "Array"],
        answer: 0,
      },

      {
        id: 144,
        question: "Which function reads Excel files in pandas?",
        options: [
          "read_excel()",
          "open_excel()",
          "load_excel()",
          "import_excel()",
        ],
        answer: 0,
      },

      {
        id: 145,
        question: "Which function groups data in pandas?",
        options: ["groupby()", "cluster()", "combine()", "categorize()"],
        answer: 0,
      },

      {
        id: 146,
        question: "Which function merges datasets?",
        options: ["merge()", "append()", "join_data()", "combine_rows()"],
        answer: 0,
      },

      {
        id: 147,
        question: "Which method adds rows from another dataframe?",
        options: ["append()", "merge()", "combine()", "stack()"],
        answer: 0,
      },

      {
        id: 148,
        question: "Which operator assigns value to variable?",
        options: ["=", "==", "!=", "<>"],
        answer: 0,
      },

      {
        id: 149,
        question: "Which keyword exits a loop?",
        options: ["break", "exit", "stop", "halt"],
        answer: 0,
      },

      {
        id: 150,
        question: "Which keyword skips current loop iteration?",
        options: ["continue", "skip", "pass", "break"],
        answer: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // LEVEL 2 — Statistics & Visualisation
  // ─────────────────────────────────────────────
  {
    level: 2,
    label: "STATS & VIZ",
    asteroidSpeed: 1.3,
    spawnInterval: 2800,
    questions: [
      {
        id: 201,
        question: "What is the mean of a dataset?",
        options: [
          "The middle value",
          "The average value",
          "The highest value",
          "The lowest value",
        ],
        answer: 1,
      },

      {
        id: 202,
        question: "What is the median?",
        options: [
          "The most frequent value",
          "The middle value in sorted data",
          "The average",
          "The largest value",
        ],
        answer: 1,
      },

      {
        id: 203,
        question: "What is the mode?",
        options: [
          "Most frequent value",
          "Average value",
          "Middle value",
          "Difference between values",
        ],
        answer: 0,
      },

      {
        id: 204,
        question: "Which chart is best for showing trends over time?",
        options: ["Pie chart", "Bar chart", "Line chart", "Scatter plot"],
        answer: 2,
      },

      {
        id: 205,
        question: "What does standard deviation measure?",
        options: [
          "Spread of data around mean",
          "Maximum value",
          "Dataset size",
          "Average value",
        ],
        answer: 0,
      },

      {
        id: 206,
        question: "What is an outlier?",
        options: [
          "Most common value",
          "A value far from other values",
          "Missing value",
          "Average value",
        ],
        answer: 1,
      },

      {
        id: 207,
        question: "What does df.describe() show?",
        options: [
          "Data types",
          "Summary statistics",
          "First rows",
          "Column names",
        ],
        answer: 1,
      },

      {
        id: 208,
        question: "What does a histogram display?",
        options: [
          "Category comparison",
          "Frequency distribution",
          "Time trends",
          "Correlation",
        ],
        answer: 1,
      },

      {
        id: 209,
        question: "What does a pie chart represent?",
        options: [
          "Time trends",
          "Frequency distribution",
          "Proportion of a whole",
          "Data spread",
        ],
        answer: 2,
      },

      {
        id: 210,
        question: "Which library is used for statistical visualization?",
        options: ["NumPy", "Seaborn", "Requests", "Flask"],
        answer: 1,
      },

      {
        id: 211,
        question: "Which chart compares categories?",
        options: ["Line chart", "Histogram", "Bar chart", "Scatter plot"],
        answer: 2,
      },

      {
        id: 212,
        question: "Which chart shows relationship between two variables?",
        options: ["Scatter plot", "Pie chart", "Histogram", "Bar chart"],
        answer: 0,
      },

      {
        id: 213,
        question: "Variance measures:",
        options: [
          "Data spread",
          "Average value",
          "Middle value",
          "Number of categories",
        ],
        answer: 0,
      },

      {
        id: 214,
        question: "Which chart shows distribution of data?",
        options: ["Histogram", "Pie chart", "Line chart", "Bar chart"],
        answer: 0,
      },

      {
        id: 215,
        question: "Which library is built on matplotlib?",
        options: ["Seaborn", "Flask", "Django", "NumPy"],
        answer: 0,
      },

      {
        id: 216,
        question: "Which plot is used to detect outliers?",
        options: ["Box plot", "Pie chart", "Bar chart", "Line chart"],
        answer: 0,
      },

      {
        id: 217,
        question: "What does a box plot show?",
        options: [
          "Data distribution",
          "Only averages",
          "Category names",
          "Dataset size",
        ],
        answer: 0,
      },

      {
        id: 218,
        question: "What does correlation measure?",
        options: [
          "Relationship between variables",
          "Dataset size",
          "Average value",
          "Missing values",
        ],
        answer: 0,
      },

      {
        id: 219,
        question: "Correlation values range between:",
        options: ["0 to 1", "-1 to 1", "0 to 100", "1 to 10"],
        answer: 1,
      },

      {
        id: 220,
        question: "Which correlation indicates strong positive relation?",
        options: ["0", "0.9", "-0.5", "-1"],
        answer: 1,
      },

      {
        id: 221,
        question: "Which measure represents data center?",
        options: ["Mean", "Variance", "Standard deviation", "Range"],
        answer: 0,
      },

      {
        id: 222,
        question: "Range equals:",
        options: [
          "Max - Min",
          "Mean - Median",
          "Sum of values",
          "Median - Mode",
        ],
        answer: 0,
      },

      {
        id: 223,
        question: "What does a line graph represent?",
        options: [
          "Trends over time",
          "Categories",
          "Proportions",
          "Distribution",
        ],
        answer: 0,
      },

      {
        id: 224,
        question: "Which chart is best for proportions?",
        options: ["Pie chart", "Histogram", "Scatter plot", "Line chart"],
        answer: 0,
      },

      {
        id: 225,
        question: "Which visualization library is most common in Python?",
        options: ["Matplotlib", "TensorFlow", "Requests", "Scikit-learn"],
        answer: 0,
      },

      {
        id: 226,
        question: "Which plot compares two numeric variables?",
        options: ["Scatter plot", "Pie chart", "Bar chart", "Histogram"],
        answer: 0,
      },

      {
        id: 227,
        question: "Which statistic measures dispersion?",
        options: ["Standard deviation", "Mean", "Median", "Mode"],
        answer: 0,
      },

      {
        id: 228,
        question: "What does skewness measure?",
        options: [
          "Data symmetry",
          "Dataset size",
          "Average value",
          "Frequency",
        ],
        answer: 0,
      },

      {
        id: 229,
        question: "Right skew means:",
        options: [
          "Tail extends right",
          "Tail extends left",
          "Data symmetric",
          "No spread",
        ],
        answer: 0,
      },

      {
        id: 230,
        question: "Left skew means:",
        options: [
          "Tail extends left",
          "Tail extends right",
          "Symmetrical data",
          "Flat distribution",
        ],
        answer: 0,
      },

      {
        id: 231,
        question: "Which chart compares groups of data?",
        options: ["Bar chart", "Line chart", "Pie chart", "Scatter plot"],
        answer: 0,
      },

      {
        id: 232,
        question: "Which plot visualizes distribution shape?",
        options: ["Histogram", "Line chart", "Pie chart", "Bar chart"],
        answer: 0,
      },

      {
        id: 233,
        question: "Which measure represents most frequent value?",
        options: ["Mode", "Median", "Mean", "Range"],
        answer: 0,
      },

      {
        id: 234,
        question: "Which chart shows data clusters?",
        options: ["Scatter plot", "Pie chart", "Bar chart", "Line chart"],
        answer: 0,
      },

      {
        id: 235,
        question: "Which metric measures prediction error?",
        options: ["Mean Squared Error", "Mean", "Median", "Mode"],
        answer: 0,
      },

      {
        id: 236,
        question: "What does heatmap visualize?",
        options: [
          "Matrix of values",
          "Single value",
          "Text data",
          "Random data",
        ],
        answer: 0,
      },

      {
        id: 237,
        question: "Which seaborn function creates heatmaps?",
        options: ["heatmap()", "map()", "plotmap()", "matrix()"],
        answer: 0,
      },

      {
        id: 238,
        question: "Which visualization compares distributions?",
        options: ["Box plot", "Pie chart", "Line chart", "Scatter plot"],
        answer: 0,
      },

      {
        id: 239,
        question: "Which measure indicates variability?",
        options: ["Variance", "Mean", "Median", "Mode"],
        answer: 0,
      },

      {
        id: 240,
        question: "Which chart shows cumulative values?",
        options: ["Area chart", "Pie chart", "Scatter plot", "Bar chart"],
        answer: 0,
      },

      {
        id: 241,
        question: "Which function plots charts in matplotlib?",
        options: [
          "plt.plot()",
          "plt.showchart()",
          "plt.create()",
          "plt.display()",
        ],
        answer: 0,
      },

      {
        id: 242,
        question: "Which command displays matplotlib figure?",
        options: [
          "plt.show()",
          "plt.display()",
          "plt.render()",
          "plt.output()",
        ],
        answer: 0,
      },

      {
        id: 243,
        question: "Which chart shows density of data?",
        options: ["Histogram", "Bar chart", "Pie chart", "Line chart"],
        answer: 0,
      },

      {
        id: 244,
        question: "Which statistical measure finds center of sorted data?",
        options: ["Median", "Mean", "Mode", "Range"],
        answer: 0,
      },

      {
        id: 245,
        question: "Which chart shows comparison of quantities?",
        options: ["Bar chart", "Pie chart", "Line chart", "Scatter plot"],
        answer: 0,
      },

      {
        id: 246,
        question: "Which library improves matplotlib aesthetics?",
        options: ["Seaborn", "Flask", "NumPy", "Requests"],
        answer: 0,
      },

      {
        id: 247,
        question: "Which chart represents correlation visually?",
        options: ["Scatter plot", "Pie chart", "Bar chart", "Line chart"],
        answer: 0,
      },

      {
        id: 248,
        question: "Which statistic measures dataset spread?",
        options: ["Standard deviation", "Mean", "Median", "Mode"],
        answer: 0,
      },

      {
        id: 249,
        question: "Which chart type shows frequency bins?",
        options: ["Histogram", "Scatter plot", "Pie chart", "Line chart"],
        answer: 0,
      },

      {
        id: 250,
        question: "Which chart best shows relationships between variables?",
        options: ["Scatter plot", "Pie chart", "Histogram", "Bar chart"],
        answer: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // LEVEL 3 — Machine Learning Basics
  // ─────────────────────────────────────────────
  {
    level: 3,
    label: "ML BASICS",
    asteroidSpeed: 2.0,
    spawnInterval: 2000,
    questions: [
      {
        id: 301,
        question: "What is supervised learning?",
        options: [
          "Learning with labelled data",
          "Learning without labels",
          "Learning through rewards",
          "Learning through simulation",
        ],
        answer: 0,
      },

      {
        id: 302,
        question: "Which algorithm is used for classification?",
        options: ["Logistic Regression", "K-Means", "PCA", "Apriori"],
        answer: 0,
      },

      {
        id: 303,
        question: "What is overfitting?",
        options: [
          "Model performs well on training but poorly on new data",
          "Model performs poorly everywhere",
          "Model is too simple",
          "Model trains very fast",
        ],
        answer: 0,
      },

      {
        id: 304,
        question: "What is the purpose of a training dataset?",
        options: [
          "Train the model",
          "Evaluate model performance",
          "Store predictions",
          "Visualize results",
        ],
        answer: 0,
      },

      {
        id: 305,
        question: "What does model accuracy represent?",
        options: [
          "Percentage of correct predictions",
          "Training time",
          "Dataset size",
          "Number of features",
        ],
        answer: 0,
      },

      {
        id: 306,
        question: "Which Python library provides ML algorithms?",
        options: ["Scikit-learn", "Flask", "Requests", "Matplotlib"],
        answer: 0,
      },

      {
        id: 307,
        question: "K-Means is an example of:",
        options: [
          "Unsupervised learning",
          "Supervised learning",
          "Reinforcement learning",
          "Transfer learning",
        ],
        answer: 0,
      },

      {
        id: 308,
        question: "What is a label in machine learning?",
        options: [
          "Target variable",
          "Feature column",
          "Algorithm type",
          "Visualization",
        ],
        answer: 0,
      },

      {
        id: 309,
        question: "What does train_test_split do?",
        options: [
          "Splits dataset into training and testing sets",
          "Trains and tests model simultaneously",
          "Removes duplicates",
          "Normalizes data",
        ],
        answer: 0,
      },

      {
        id: 310,
        question: "What is feature engineering?",
        options: [
          "Creating useful input variables",
          "Building neural networks",
          "Cleaning null values",
          "Splitting datasets",
        ],
        answer: 0,
      },

      {
        id: 311,
        question: "Which algorithm is used for regression?",
        options: ["Linear Regression", "K-Means", "Apriori", "DBSCAN"],
        answer: 0,
      },

      {
        id: 312,
        question: "Which algorithm is used for clustering?",
        options: [
          "K-Means",
          "Linear Regression",
          "Decision Tree",
          "Logistic Regression",
        ],
        answer: 0,
      },

      {
        id: 313,
        question: "What is a feature in ML?",
        options: [
          "Input variable",
          "Output variable",
          "Prediction value",
          "Dataset size",
        ],
        answer: 0,
      },

      {
        id: 314,
        question: "What is model prediction?",
        options: [
          "Output generated by model",
          "Training dataset",
          "Algorithm type",
          "Feature engineering",
        ],
        answer: 0,
      },

      {
        id: 315,
        question: "What is underfitting?",
        options: [
          "Model too simple to capture patterns",
          "Model memorizes data",
          "Model trains slowly",
          "Model predicts perfectly",
        ],
        answer: 0,
      },

      {
        id: 316,
        question: "Which algorithm uses decision rules?",
        options: [
          "Decision Tree",
          "K-Means",
          "Naive Bayes",
          "Linear Regression",
        ],
        answer: 0,
      },

      {
        id: 317,
        question: "Which ML task predicts categories?",
        options: [
          "Classification",
          "Regression",
          "Clustering",
          "Dimensionality reduction",
        ],
        answer: 0,
      },

      {
        id: 318,
        question: "Which ML task predicts numbers?",
        options: ["Regression", "Classification", "Clustering", "Segmentation"],
        answer: 0,
      },

      {
        id: 319,
        question: "What is model evaluation?",
        options: [
          "Assessing model performance",
          "Building model",
          "Collecting data",
          "Cleaning data",
        ],
        answer: 0,
      },

      {
        id: 320,
        question: "Which metric measures classification accuracy?",
        options: ["Accuracy", "Variance", "Mean", "Range"],
        answer: 0,
      },

      {
        id: 321,
        question: "Which algorithm is based on probability?",
        options: [
          "Naive Bayes",
          "Decision Tree",
          "Linear Regression",
          "K-Means",
        ],
        answer: 0,
      },

      {
        id: 322,
        question: "Which model structure resembles a tree?",
        options: ["Decision Tree", "Logistic Regression", "K-Means", "SVM"],
        answer: 0,
      },

      {
        id: 323,
        question: "Which algorithm finds hyperplanes?",
        options: [
          "Support Vector Machine",
          "Linear Regression",
          "K-Means",
          "Naive Bayes",
        ],
        answer: 0,
      },

      {
        id: 324,
        question: "Which ML method groups similar data points?",
        options: ["Clustering", "Regression", "Classification", "Forecasting"],
        answer: 0,
      },

      {
        id: 325,
        question: "Which step prepares raw data for ML?",
        options: [
          "Data preprocessing",
          "Prediction",
          "Evaluation",
          "Deployment",
        ],
        answer: 0,
      },

      {
        id: 326,
        question: "Which technique reduces number of features?",
        options: [
          "Dimensionality reduction",
          "Classification",
          "Regression",
          "Clustering",
        ],
        answer: 0,
      },

      {
        id: 327,
        question: "Which algorithm reduces dimensionality?",
        options: ["PCA", "K-Means", "Decision Tree", "SVM"],
        answer: 0,
      },

      {
        id: 328,
        question: "Which ML process improves model performance?",
        options: [
          "Hyperparameter tuning",
          "Data deletion",
          "Visualization",
          "Sorting",
        ],
        answer: 0,
      },

      {
        id: 329,
        question: "Which dataset evaluates trained model?",
        options: [
          "Test dataset",
          "Training dataset",
          "Raw dataset",
          "Feature dataset",
        ],
        answer: 0,
      },

      {
        id: 330,
        question: "Which dataset helps tune model parameters?",
        options: [
          "Validation dataset",
          "Training dataset",
          "Test dataset",
          "Raw dataset",
        ],
        answer: 0,
      },

      {
        id: 331,
        question: "Which algorithm predicts probabilities?",
        options: ["Logistic Regression", "K-Means", "PCA", "Random Forest"],
        answer: 0,
      },

      {
        id: 332,
        question: "Which ensemble method combines many trees?",
        options: [
          "Random Forest",
          "Linear Regression",
          "Naive Bayes",
          "K-Means",
        ],
        answer: 0,
      },

      {
        id: 333,
        question: "Which algorithm uses boosting technique?",
        options: [
          "Gradient Boosting",
          "Linear Regression",
          "K-Means",
          "Naive Bayes",
        ],
        answer: 0,
      },

      {
        id: 334,
        question: "Which ML step collects data?",
        options: [
          "Data acquisition",
          "Model evaluation",
          "Prediction",
          "Deployment",
        ],
        answer: 0,
      },

      {
        id: 335,
        question: "Which ML step uses trained model in real systems?",
        options: ["Deployment", "Training", "Evaluation", "Cleaning"],
        answer: 0,
      },

      {
        id: 336,
        question: "Which library provides datasets for ML testing?",
        options: ["Scikit-learn", "Flask", "Requests", "NumPy"],
        answer: 0,
      },

      {
        id: 337,
        question: "Which ML metric measures error?",
        options: ["Mean Squared Error", "Accuracy", "Median", "Mode"],
        answer: 0,
      },

      {
        id: 338,
        question: "Which ML metric measures classification precision?",
        options: ["Precision", "Variance", "Mean", "Range"],
        answer: 0,
      },

      {
        id: 339,
        question: "Which metric measures recall?",
        options: ["Recall", "Mean", "Variance", "Range"],
        answer: 0,
      },

      {
        id: 340,
        question: "Which curve visualizes classification performance?",
        options: ["ROC Curve", "Line Chart", "Pie Chart", "Histogram"],
        answer: 0,
      },

      {
        id: 341,
        question: "Which algorithm uses nearest neighbors?",
        options: ["KNN", "K-Means", "SVM", "Naive Bayes"],
        answer: 0,
      },

      {
        id: 342,
        question: "Which ML method learns from rewards?",
        options: [
          "Reinforcement Learning",
          "Supervised Learning",
          "Clustering",
          "Regression",
        ],
        answer: 0,
      },

      {
        id: 343,
        question: "Which algorithm predicts using distance metrics?",
        options: ["KNN", "Naive Bayes", "Decision Tree", "Linear Regression"],
        answer: 0,
      },

      {
        id: 344,
        question: "Which ML method uses labelled outputs?",
        options: [
          "Supervised learning",
          "Unsupervised learning",
          "Reinforcement learning",
          "Self learning",
        ],
        answer: 0,
      },

      {
        id: 345,
        question: "Which ML task finds hidden patterns?",
        options: [
          "Unsupervised learning",
          "Regression",
          "Classification",
          "Forecasting",
        ],
        answer: 0,
      },

      {
        id: 346,
        question: "Which technique scales numeric features?",
        options: ["Normalization", "Sorting", "Encoding", "Visualization"],
        answer: 0,
      },

      {
        id: 347,
        question: "Which technique converts categories to numbers?",
        options: ["Encoding", "Sorting", "Prediction", "Cleaning"],
        answer: 0,
      },

      {
        id: 348,
        question: "Which ML model predicts continuous values?",
        options: [
          "Regression model",
          "Classification model",
          "Clustering model",
          "Segmentation model",
        ],
        answer: 0,
      },

      {
        id: 349,
        question: "Which ML method separates data using margin?",
        options: [
          "Support Vector Machine",
          "K-Means",
          "Naive Bayes",
          "Decision Tree",
        ],
        answer: 0,
      },

      {
        id: 350,
        question: "Which ML concept improves generalization?",
        options: ["Regularization", "Overfitting", "Memorization", "Sorting"],
        answer: 0,
      },
    ],
  },
  // ─────────────────────────────────────────────
  // LEVEL 4 — Data Cleaning & Preprocessing
  // ─────────────────────────────────────────────
  {
    level: 4,
    label: "ML BASICS",
    asteroidSpeed: 2.0,
    spawnInterval: 2000,
    questions: [
      {
        id: 401,
        question: "What is data cleaning?",
        options: [
          "Removing errors from data",
          "Creating charts",
          "Building ML models",
          "Storing data",
        ],
        answer: 0,
      },

      {
        id: 402,
        question: "Which pandas function removes missing values?",
        options: ["dropna()", "fillna()", "replace()", "clean()"],
        answer: 0,
      },

      {
        id: 403,
        question: "Which function replaces missing values?",
        options: ["replace()", "fillna()", "dropna()", "update()"],
        answer: 1,
      },

      {
        id: 404,
        question: "What does df.drop_duplicates() do?",
        options: [
          "Removes duplicate rows",
          "Sorts dataset",
          "Removes columns",
          "Renames columns",
        ],
        answer: 0,
      },

      {
        id: 405,
        question: "Which method fills missing values with a constant?",
        options: ["fillna()", "replace()", "update()", "insert()"],
        answer: 0,
      },

      {
        id: 406,
        question: "What is data preprocessing?",
        options: [
          "Preparing data for analysis",
          "Visualizing charts",
          "Training ML models",
          "Deploying models",
        ],
        answer: 0,
      },

      {
        id: 407,
        question: "Which function renames columns?",
        options: ["rename()", "rename_cols()", "update_columns()", "change()"],
        answer: 0,
      },

      {
        id: 408,
        question: "Which function converts datatype in pandas?",
        options: ["astype()", "convert()", "dtype()", "cast()"],
        answer: 0,
      },

      {
        id: 409,
        question: "Which function checks missing values?",
        options: ["isnull()", "isempty()", "checknull()", "missing()"],
        answer: 0,
      },

      {
        id: 410,
        question: "Which function counts missing values?",
        options: [
          "isnull().sum()",
          "missing()",
          "nullcount()",
          "df.countnull()",
        ],
        answer: 0,
      },

      {
        id: 411,
        question: "Which function replaces specific values?",
        options: ["replace()", "fillna()", "drop()", "rename()"],
        answer: 0,
      },

      {
        id: 412,
        question: "Which function sorts dataframe rows?",
        options: ["sort_values()", "order_rows()", "arrange()", "sort_df()"],
        answer: 0,
      },

      {
        id: 413,
        question: "Which function resets dataframe index?",
        options: ["reset_index()", "reset()", "clear_index()", "new_index()"],
        answer: 0,
      },

      {
        id: 414,
        question: "Which function removes a column?",
        options: ["drop()", "remove()", "delete()", "cut()"],
        answer: 0,
      },

      {
        id: 415,
        question: "Which function changes column datatype?",
        options: ["astype()", "dtype()", "convert_type()", "switch()"],
        answer: 0,
      },

      {
        id: 416,
        question: "Which method detects duplicate rows?",
        options: ["duplicated()", "repeat()", "same()", "copy()"],
        answer: 0,
      },

      {
        id: 417,
        question: "Which function merges datasets?",
        options: ["merge()", "combine()", "stack()", "append_rows()"],
        answer: 0,
      },

      {
        id: 418,
        question: "Which function concatenates dataframes?",
        options: ["concat()", "merge()", "append()", "stack()"],
        answer: 0,
      },

      {
        id: 419,
        question: "Which function joins tables by index?",
        options: ["join()", "merge()", "combine()", "concat()"],
        answer: 0,
      },

      {
        id: 420,
        question: "Which preprocessing technique scales features?",
        options: ["Normalization", "Sorting", "Encoding", "Filtering"],
        answer: 0,
      },

      {
        id: 421,
        question: "Which technique converts categorical values to numbers?",
        options: ["Encoding", "Sorting", "Cleaning", "Filtering"],
        answer: 0,
      },

      {
        id: 422,
        question: "Which encoding converts categories to binary columns?",
        options: [
          "One-hot encoding",
          "Label encoding",
          "Binary sorting",
          "Ordinal mapping",
        ],
        answer: 0,
      },

      {
        id: 423,
        question: "Which encoding assigns numeric labels?",
        options: [
          "Label encoding",
          "One-hot encoding",
          "Binary encoding",
          "Mapping",
        ],
        answer: 0,
      },

      {
        id: 424,
        question: "Which function applies a function to dataframe values?",
        options: ["apply()", "run()", "execute()", "operate()"],
        answer: 0,
      },

      {
        id: 425,
        question: "Which function applies element-wise operations?",
        options: ["applymap()", "apply()", "mapdf()", "runmap()"],
        answer: 0,
      },

      {
        id: 426,
        question: "Which function maps values in a column?",
        options: ["map()", "apply()", "replace()", "fillna()"],
        answer: 0,
      },

      {
        id: 427,
        question: "Which pandas function filters rows?",
        options: ["loc[]", "groupby()", "merge()", "reset_index()"],
        answer: 0,
      },

      {
        id: 428,
        question: "Which method selects rows by position?",
        options: ["iloc[]", "loc[]", "index[]", "position[]"],
        answer: 0,
      },

      {
        id: 429,
        question: "Which method selects rows by label?",
        options: ["loc[]", "iloc[]", "rowlabel()", "pick()"],
        answer: 0,
      },

      {
        id: 430,
        question: "Which step removes inconsistent data?",
        options: [
          "Data cleaning",
          "Feature extraction",
          "Model training",
          "Deployment",
        ],
        answer: 0,
      },

      {
        id: 431,
        question: "Which preprocessing method scales values between 0 and 1?",
        options: ["Normalization", "Encoding", "Sorting", "Cleaning"],
        answer: 0,
      },

      {
        id: 432,
        question: "Which technique standardizes data around mean 0?",
        options: ["Standardization", "Normalization", "Sorting", "Encoding"],
        answer: 0,
      },

      {
        id: 433,
        question: "Which library provides preprocessing tools?",
        options: ["Scikit-learn", "Flask", "Requests", "Matplotlib"],
        answer: 0,
      },

      {
        id: 434,
        question: "Which sklearn class performs scaling?",
        options: [
          "StandardScaler",
          "DecisionTree",
          "LinearRegression",
          "RandomForest",
        ],
        answer: 0,
      },

      {
        id: 435,
        question: "Which sklearn class performs normalization?",
        options: ["MinMaxScaler", "RandomForest", "SVM", "KMeans"],
        answer: 0,
      },

      {
        id: 436,
        question: "Which method detects outliers visually?",
        options: ["Box plot", "Pie chart", "Line chart", "Bar chart"],
        answer: 0,
      },

      {
        id: 437,
        question: "Which technique removes extreme values?",
        options: ["Outlier removal", "Encoding", "Normalization", "Sorting"],
        answer: 0,
      },

      {
        id: 438,
        question: "Which pandas method clips values in range?",
        options: ["clip()", "limit()", "range()", "bound()"],
        answer: 0,
      },

      {
        id: 439,
        question: "Which step ensures consistent data types?",
        options: [
          "Data transformation",
          "Prediction",
          "Deployment",
          "Evaluation",
        ],
        answer: 0,
      },

      {
        id: 440,
        question: "Which function samples random rows?",
        options: ["sample()", "random_rows()", "pick()", "shuffle_rows()"],
        answer: 0,
      },

      {
        id: 441,
        question: "Which function reshapes dataframe?",
        options: ["pivot()", "merge()", "append()", "sort_values()"],
        answer: 0,
      },

      {
        id: 442,
        question: "Which function melts dataframe to long format?",
        options: ["melt()", "pivot()", "stack()", "reshape()"],
        answer: 0,
      },

      {
        id: 443,
        question: "Which function stacks dataframe levels?",
        options: ["stack()", "melt()", "pivot()", "groupby()"],
        answer: 0,
      },

      {
        id: 444,
        question: "Which function unstacks dataframe levels?",
        options: ["unstack()", "stack()", "pivot()", "reshape()"],
        answer: 0,
      },

      {
        id: 445,
        question: "Which method groups data by category?",
        options: ["groupby()", "merge()", "sort_values()", "pivot()"],
        answer: 0,
      },

      {
        id: 446,
        question: "Which function aggregates grouped data?",
        options: ["agg()", "sumdata()", "groupcalc()", "collect()"],
        answer: 0,
      },

      {
        id: 447,
        question: "Which method filters grouped results?",
        options: ["filter()", "select()", "choose()", "reduce()"],
        answer: 0,
      },

      {
        id: 448,
        question: "Which method transforms grouped data?",
        options: ["transform()", "map()", "apply()", "filter()"],
        answer: 0,
      },

      {
        id: 449,
        question: "Which function reshapes table columns to rows?",
        options: ["melt()", "pivot()", "stack()", "join()"],
        answer: 0,
      },

      {
        id: 450,
        question: "Which function reshapes rows to columns?",
        options: ["pivot()", "melt()", "stack()", "join()"],
        answer: 0,
      },
    ],
  },
  // ─────────────────────────────────────────────
  // LEVEL 5 — SQL Basics
  // ─────────────────────────────────────────────
  {
    level: 5,
    label: "ML BASICS",
    asteroidSpeed: 2.0,
    spawnInterval: 2000,
    questions: [
      {
        id: 501,
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "Structured Question Logic",
          "Sequential Query Language",
        ],
        answer: 0,
      },

      {
        id: 502,
        question: "Which SQL command retrieves data from a table?",
        options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
        answer: 1,
      },

      {
        id: 503,
        question: "Which clause filters rows in SQL?",
        options: ["WHERE", "ORDER BY", "GROUP BY", "HAVING"],
        answer: 0,
      },

      {
        id: 504,
        question: "Which SQL command sorts results?",
        options: ["ORDER BY", "SORT", "GROUP BY", "FILTER"],
        answer: 0,
      },

      {
        id: 505,
        question: "Which SQL statement inserts new data?",
        options: ["INSERT INTO", "ADD ROW", "NEW DATA", "CREATE ROW"],
        answer: 0,
      },

      {
        id: 506,
        question: "Which SQL statement updates existing data?",
        options: ["MODIFY", "UPDATE", "CHANGE", "SET ROW"],
        answer: 1,
      },

      {
        id: 507,
        question: "Which SQL statement removes data?",
        options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
        answer: 1,
      },

      {
        id: 508,
        question: "Which SQL clause groups rows with same values?",
        options: ["GROUP BY", "ORDER BY", "WHERE", "SORT"],
        answer: 0,
      },

      {
        id: 509,
        question: "Which SQL clause filters grouped data?",
        options: ["HAVING", "WHERE", "FILTER", "GROUP"],
        answer: 0,
      },

      {
        id: 510,
        question: "Which SQL function counts rows?",
        options: ["COUNT()", "SUM()", "TOTAL()", "NUMBER()"],
        answer: 0,
      },

      {
        id: 511,
        question: "Which SQL function calculates average?",
        options: ["AVG()", "MEAN()", "AVERAGE()", "MID()"],
        answer: 0,
      },

      {
        id: 512,
        question: "Which SQL function returns maximum value?",
        options: ["MAX()", "TOP()", "UPPER()", "HIGH()"],
        answer: 0,
      },

      {
        id: 513,
        question: "Which SQL function returns minimum value?",
        options: ["MIN()", "LOW()", "BOTTOM()", "SMALL()"],
        answer: 0,
      },

      {
        id: 514,
        question: "Which SQL function adds values?",
        options: ["SUM()", "ADD()", "TOTAL()", "COUNT()"],
        answer: 0,
      },

      {
        id: 515,
        question: "Which SQL keyword removes duplicate results?",
        options: ["DISTINCT", "UNIQUE", "REMOVE DUPLICATES", "FILTER"],
        answer: 0,
      },

      {
        id: 516,
        question: "Which SQL command creates a table?",
        options: ["CREATE TABLE", "MAKE TABLE", "NEW TABLE", "BUILD TABLE"],
        answer: 0,
      },

      {
        id: 517,
        question: "Which SQL command deletes a table?",
        options: ["DROP TABLE", "DELETE TABLE", "REMOVE TABLE", "CLEAR TABLE"],
        answer: 0,
      },

      {
        id: 518,
        question: "Which SQL command modifies table structure?",
        options: [
          "ALTER TABLE",
          "MODIFY TABLE",
          "UPDATE TABLE",
          "CHANGE TABLE",
        ],
        answer: 0,
      },

      {
        id: 519,
        question: "Which SQL keyword limits returned rows?",
        options: ["LIMIT", "TOP", "MAXROWS", "COUNT"],
        answer: 0,
      },

      {
        id: 520,
        question: "Which SQL operator checks equality?",
        options: ["=", "==", "!=", "<>"],
        answer: 0,
      },

      {
        id: 521,
        question: "Which SQL operator means NOT equal?",
        options: ["!=", "<>", "=", "LIKE"],
        answer: 1,
      },

      {
        id: 522,
        question: "Which SQL operator finds patterns?",
        options: ["LIKE", "MATCH", "FIND", "SEARCH"],
        answer: 0,
      },

      {
        id: 523,
        question: "Which SQL wildcard represents multiple characters?",
        options: ["%", "_", "*", "#"],
        answer: 0,
      },

      {
        id: 524,
        question: "Which SQL wildcard represents a single character?",
        options: ["_", "%", "*", "?"],
        answer: 0,
      },

      {
        id: 525,
        question: "Which SQL keyword sorts ascending?",
        options: ["ASC", "UP", "SORT", "TOP"],
        answer: 0,
      },

      {
        id: 526,
        question: "Which SQL keyword sorts descending?",
        options: ["DESC", "DOWN", "SORTDESC", "LOW"],
        answer: 0,
      },

      {
        id: 527,
        question: "Which SQL clause combines rows from two tables?",
        options: ["JOIN", "MERGE", "CONNECT", "COMBINE"],
        answer: 0,
      },

      {
        id: 528,
        question: "Which join returns matching rows from both tables?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
        answer: 0,
      },

      {
        id: 529,
        question: "Which join returns all rows from left table?",
        options: ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "FULL JOIN"],
        answer: 0,
      },

      {
        id: 530,
        question: "Which join returns all rows from right table?",
        options: ["RIGHT JOIN", "LEFT JOIN", "INNER JOIN", "FULL JOIN"],
        answer: 0,
      },

      {
        id: 531,
        question: "Which join returns all rows from both tables?",
        options: ["FULL JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN"],
        answer: 0,
      },

      {
        id: 532,
        question: "Which SQL keyword checks multiple conditions?",
        options: ["AND", "OR", "NOT", "ALL"],
        answer: 0,
      },

      {
        id: 533,
        question: "Which SQL keyword checks alternative conditions?",
        options: ["OR", "AND", "NOT", "XOR"],
        answer: 0,
      },

      {
        id: 534,
        question: "Which SQL keyword negates condition?",
        options: ["NOT", "NO", "NEGATE", "FALSE"],
        answer: 0,
      },

      {
        id: 535,
        question: "Which SQL clause selects specific columns?",
        options: ["SELECT", "CHOOSE", "GET", "SHOW"],
        answer: 0,
      },

      {
        id: 536,
        question: "Which SQL keyword renames a column in results?",
        options: ["AS", "NAME", "ALIAS", "LABEL"],
        answer: 0,
      },

      {
        id: 537,
        question: "Which SQL keyword retrieves unique rows?",
        options: ["DISTINCT", "UNIQUE", "FILTER", "GROUP"],
        answer: 0,
      },

      {
        id: 538,
        question: "Which SQL keyword selects all columns?",
        options: ["*", "ALL", "EVERY", "FULL"],
        answer: 0,
      },

      {
        id: 539,
        question: "Which SQL command creates database?",
        options: [
          "CREATE DATABASE",
          "NEW DATABASE",
          "MAKE DATABASE",
          "BUILD DATABASE",
        ],
        answer: 0,
      },

      {
        id: 540,
        question: "Which SQL command deletes database?",
        options: [
          "DROP DATABASE",
          "DELETE DATABASE",
          "REMOVE DATABASE",
          "CLEAR DATABASE",
        ],
        answer: 0,
      },

      {
        id: 541,
        question: "Which SQL clause groups rows for aggregation?",
        options: ["GROUP BY", "ORDER BY", "FILTER", "HAVING"],
        answer: 0,
      },

      {
        id: 542,
        question: "Which SQL clause filters aggregated results?",
        options: ["HAVING", "WHERE", "FILTER", "GROUP"],
        answer: 0,
      },

      {
        id: 543,
        question: "Which SQL function converts text to uppercase?",
        options: ["UPPER()", "CAPS()", "UPCASE()", "BIG()"],
        answer: 0,
      },

      {
        id: 544,
        question: "Which SQL function converts text to lowercase?",
        options: ["LOWER()", "SMALL()", "DOWNCASE()", "MINCASE()"],
        answer: 0,
      },

      {
        id: 545,
        question: "Which SQL function counts non-null values?",
        options: ["COUNT()", "SUM()", "AVG()", "TOTAL()"],
        answer: 0,
      },

      {
        id: 546,
        question: "Which SQL clause limits query results?",
        options: ["LIMIT", "COUNT", "FILTER", "STOP"],
        answer: 0,
      },

      {
        id: 547,
        question: "Which SQL keyword checks range of values?",
        options: ["BETWEEN", "IN", "RANGE", "LIMIT"],
        answer: 0,
      },

      {
        id: 548,
        question: "Which SQL keyword checks values in a list?",
        options: ["IN", "BETWEEN", "LIKE", "MATCH"],
        answer: 0,
      },

      {
        id: 549,
        question: "Which SQL clause groups results for aggregation?",
        options: ["GROUP BY", "ORDER BY", "WHERE", "HAVING"],
        answer: 0,
      },

      {
        id: 550,
        question: "Which SQL command removes all rows but keeps table?",
        options: ["TRUNCATE", "DELETE", "DROP", "CLEAR"],
        answer: 0,
      },
    ],
  },
];

export const TOTAL_LEVELS = LEVEL_QUESTION_BANK.length;

export function getLevelConfig(level: number): LevelConfig {
  return (
    LEVEL_QUESTION_BANK.find((l) => l.level === level) ??
    LEVEL_QUESTION_BANK[LEVEL_QUESTION_BANK.length - 1]
  );
}

export function getQuestionsForLevel(level: number): Question[] {
  const cfg = getLevelConfig(level);
  return shuffle([...cfg.questions]);
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
