import json

with open('data/output_deep_learning_and_cnn_300/narrated_gaps.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

gaps_json = json.dumps(data['gaps'], indent=2)

ts_lines = [
    "import { NarratedGap } from '../types';",
    "",
    "export const DEFAULT_PRESET_DATASET_ID = 'output_deep_learning_and_cnn_300';",
    'export const DEFAULT_PRESET_QUERY = \'"Deep Learning" AND "CNN"\';',
    "",
    f"export const DEFAULT_PRESET_GAPS: NarratedGap[] = ({gaps_json} as unknown as NarratedGap[]);",
    ""
]

with open('frontend/src/data/defaultPresetData.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_lines))

print("Created frontend/src/data/defaultPresetData.ts successfully!")
