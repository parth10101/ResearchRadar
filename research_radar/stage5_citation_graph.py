"""
[DEPRECATION / ALIAS NOTICE]
This module has been renamed to `research_radar.stage5_citations`
to accurately reflect its website tab output (Tab 02 Citations: The Epistemic Citation Journey).

This stub is retained for backward compatibility.
"""
from __future__ import annotations

import sys
from research_radar.stage5_citations import *  # noqa: F401, F403
import research_radar.stage5_citations as _target

if __name__ == "__main__":
    if hasattr(_target, "main"):
        _target.main()
