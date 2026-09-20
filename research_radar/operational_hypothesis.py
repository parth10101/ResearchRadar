"""
Operational Hypothesis Generator
================================
Transforms coarse candidate triads (M x D x L) into formal 5-tuple
Operationalized Scientific Hypotheses:
    G = < T, M, D, C, E >
"""

from __future__ import annotations

import json
from typing import Dict, Any, Optional
from research_radar.specificity_engine import SpecificityEngine


class OperationalHypothesisGenerator:
    """
    Expands coarse taxonomic labels into rigorous, testable experimental hypotheses
    suitable for peer review, grant funding proposals, and PhD defense scrutiny.
    """

    def __init__(self):
        self.engine = SpecificityEngine()

    def operationalize(
        self,
        method: str,
        dataset: str,
        limitation: str,
        domain_tag: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Maps a triad (M, D, L) to a fully qualified 5-tuple hypothesis.
        """
        m_lower = method.lower()
        d_lower = dataset.lower()
        l_lower = limitation.lower()

        # -------------------------------------------------------------------
        # Universal Domain Synthesis across all Scientific Fields
        # -------------------------------------------------------------------
        import os
        import requests
        from research_radar.stage8_llm_narration import _load_env_file
        _load_env_file()
        groq_key = os.environ.get("GROQ_API_KEY")

        task, mech, sensor, perturb, epistemic, hypothesis = None, None, None, None, None, None

        # 1. Attempt High-Fidelity LLM Operationalization (Groq API)
        if groq_key:
            try:
                op_prompt = (
                    f"You are a principal investigator formalizing a scientific hypothesis.\n"
                    f"Given Triad: Method='{method}', Dataset='{dataset}', Limitation='{limitation}'\n"
                    f"Output strictly a JSON object with keys:\n"
                    f"- 'task': Specific operational task\n"
                    f"- 'methodology': Concrete architectural/formal mechanism\n"
                    f"- 'dataset': Canonical scientific benchmark/substrate\n"
                    f"- 'constraint': Specific perturbation or boundary condition\n"
                    f"- 'epistemic_boundary': Failure mode or degradation quantified\n"
                    f"- 'hypothesis_statement': 1-2 sentence testable hypothesis\n"
                )
                resp = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    json={
                        "model": "llama-3.1-8b-instant",
                        "messages": [{"role": "user", "content": op_prompt}],
                        "temperature": 0.2,
                        "response_format": {"type": "json_object"},
                        "max_tokens": 300,
                    },
                    headers={"Authorization": f"Bearer {groq_key}"},
                    timeout=5.0,
                )
                if resp.status_code == 200:
                    d = resp.json()["choices"][0]["message"]["content"]
                    parsed = json.loads(d)
                    task = parsed.get("task")
                    mech = parsed.get("methodology")
                    sensor = parsed.get("dataset")
                    perturb = parsed.get("constraint")
                    epistemic = parsed.get("epistemic_boundary")
                    hypothesis = parsed.get("hypothesis_statement")
            except Exception:
                pass

        # 2. Universal Scientific Synthesis Fallback
        if not task:
            task = f"Empirical Modeling & Benchmark Evaluation of {method.title()}"
            mech = f"Advanced Algorithmic Mechanism: {method.title()}"
            sensor = f"{dataset.title()} Canonical Scientific Benchmark"
            perturb = f"Operational Boundary Regime: Direct Stress Evaluation under {limitation.title()}"
            epistemic = f"Quantifying performance boundaries and error curves of {method.title()} under {limitation.lower()}"
            hypothesis = (
                f"Applying {method} directly to {dataset} under {limitation} constraints "
                f"establishes verifiable empirical boundaries, overcoming theoretical disconnects in existing literature."
            )

        eval_res = self.engine.evaluate_candidate(task, mech, sensor, perturb)

        return {
            "task": task,
            "methodology": mech,
            "dataset": sensor,
            "constraint": perturb,
            "epistemic_boundary": epistemic,
            "hypothesis_statement": hypothesis,
            "specificity_evaluation": eval_res,
            "specificity_score": eval_res["specificity_score"],
            "is_admissible": eval_res["is_admissible"],
        }
