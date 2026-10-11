import json
from research_radar.s2_client import parse_boolean_query, matches_boolean_criteria

q_and = '"Federated Learning" AND "Differential Privacy" NOT "Edge Devices"'
print('AND Spec:', json.dumps(parse_boolean_query(q_and), indent=2))

q_or = '"Federated Learning" OR "Differential Privacy" NOT "Blockchain"'
print('OR Spec:', json.dumps(parse_boolean_query(q_or), indent=2))

paper1 = {'title': 'Adaptive Federated Learning with Differential Privacy', 'abstract': 'we study differential privacy in networks.'}
paper2 = {'title': 'Edge Devices in Federated Networks', 'abstract': 'iot edge devices in federated learning'}
paper3 = {'title': 'Deep Learning for Image Recognition', 'abstract': 'cnn models for classification'}
paper4 = {'title': 'Differential Privacy in Neural Networks', 'abstract': 'laplace mechanism'}

print('Paper 1 match AND (both in title):', matches_boolean_criteria(paper1, parse_boolean_query(q_and)))
print('Paper 2 match AND (edge devices):', matches_boolean_criteria(paper2, parse_boolean_query(q_and)))
print('Paper 3 match AND (unrelated):', matches_boolean_criteria(paper3, parse_boolean_query(q_and)))
print('Paper 4 match OR (diff priv):', matches_boolean_criteria(paper4, parse_boolean_query(q_or)))
