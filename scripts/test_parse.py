import sys
sys.path.insert(0, ".")
from research_radar.s2_client import parse_boolean_query

q2 = '("Federated Learning" AND "Differential Privacy") NOT "Blockchain"'
print("q2 parsed:", parse_boolean_query(q2))

q4 = '("Graph Neural Networks" AND "Molecular Property Prediction") NOT "Survey"'
print("q4 parsed:", parse_boolean_query(q4))
