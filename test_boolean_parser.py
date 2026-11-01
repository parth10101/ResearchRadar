from research_radar.boolean_parser import BooleanQuery

# Case 1: 3-term AND (a b c)
bq1 = BooleanQuery("artificial intelligence and cnn and transfer learning")
print("Case 1: a AND b AND c")
print("  Concepts:", bq1.concepts)
print("  Positive clauses:", bq1.positive_clauses)
print("  Negative terms:", bq1.negative_terms)
assert len(bq1.concepts) == 3

# Test paper matching all 3
p_good = "Applying transfer learning in CNN model architectures for detecting tomato diseases using artificial intelligence"
p_bad = "Convolutional neural networks for object detection"
print("  Evaluates good paper:", bq1.evaluate(p_good))
print("  Evaluates bad paper:", bq1.evaluate(p_bad))
assert bq1.evaluate(p_good) is True
assert bq1.evaluate(p_bad) is False

# Case 2: AND with NOT
bq2 = BooleanQuery("cnn and transfer learning not rnn")
print("\nCase 2: a AND b NOT c")
print("  Concepts:", bq2.concepts)
print("  Negative terms:", bq2.negative_terms)
p_rnn = "Transfer learning with CNN and RNN for speech recognition"
print("  Evaluates paper with RNN (should be False):", bq2.evaluate(p_rnn))
assert bq2.evaluate(p_rnn) is False

# Case 3: OR with AND
bq3 = BooleanQuery("transformers or cnn and medical imaging")
print("\nCase 3: (a OR b) AND c")
print("  Concepts:", bq3.concepts)
print("  Positive clauses:", bq3.positive_clauses)
p_trans = "Vision transformers for medical imaging segmentation"
p_cnn = "Deep CNN architectures for medical imaging analysis"
p_none = "Generative adversarial networks for text generation"
print("  Evaluates transformer paper:", bq3.evaluate(p_trans))
print("  Evaluates cnn paper:", bq3.evaluate(p_cnn))
print("  Evaluates none paper:", bq3.evaluate(p_none))
assert bq3.evaluate(p_trans) is True
assert bq3.evaluate(p_cnn) is True
assert bq3.evaluate(p_none) is False

# Case 4: Human typo tolerance
bq4 = BooleanQuery("Artificial Inteligence and cnn")
print("\nCase 4: Typo 'Inteligence'")
print("  Concepts:", bq4.concepts)
assert bq4.concepts[0].lower() == "artificial intelligence"

print("\nALL BOOLEAN PARSER TESTS PASSED 100%!")
