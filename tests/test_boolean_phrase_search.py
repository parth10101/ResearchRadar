import sys
import os
sys.path.insert(0, os.path.abspath("."))
import unittest
from research_radar.s2_client import parse_boolean_query, matches_boolean_criteria


def test_parse_boolean_query_unquoted_and():
    q = "Deep learning AND Image processing"
    spec = parse_boolean_query(q)
    assert spec["must"] == ["deep learning", "image processing"]
    assert spec["must_not"] == []
    assert spec["should"] == []
    assert spec["clean_s2_query"] == '"deep learning" "image processing"'


def test_parse_boolean_query_quoted_and():
    q = '"Deep learning" AND "Image processing"'
    spec = parse_boolean_query(q)
    assert spec["must"] == ["deep learning", "image processing"]
    assert spec["must_not"] == []


def test_parse_boolean_query_with_not():
    q = "Deep learning AND Image processing NOT Medical"
    spec = parse_boolean_query(q)
    assert spec["must"] == ["deep learning", "image processing"]
    assert spec["must_not"] == ["medical"]


def test_parse_boolean_query_with_or():
    q = "Deep learning OR Computer Vision"
    spec = parse_boolean_query(q)
    assert spec["should"] == ["deep learning", "computer vision"]
    assert spec["must"] == []


def test_parse_boolean_query_with_ampersand():
    q = "Deep learning & Image processing"
    spec = parse_boolean_query(q)
    assert spec["must"] == ["deep learning", "image processing"]


def test_matches_both_phrases_present():
    spec = parse_boolean_query("Deep learning AND Image processing")
    paper = {
        "title": "A Survey of Deep Learning in Satellite Image Processing",
        "abstract": "We evaluate deep learning pipelines across modern earth observation systems.",
    }
    matches, score = matches_boolean_criteria(paper, spec)
    assert matches is True
    assert score > 0


def test_rejects_single_words_scattered():
    """
    Teacher requirement: 'what shouldn't happen is:
    if the query is Deep learning AND Image processing then these 2 words should be there
    compulsorily in all the results with the semantic understanding not single words deep or
    learning separately or singularly present'
    """
    spec = parse_boolean_query("Deep learning AND Image processing")
    paper = {
        "title": "A deep understanding of reinforcement learning in games",
        "abstract": "We explore deep neural architectures and multi-agent game learning policies.",
    }
    matches, score = matches_boolean_criteria(paper, spec)
    assert matches is False
    assert score == 0


def test_rejects_only_one_phrase_present():
    spec = parse_boolean_query("Deep learning AND Image processing")
    paper = {
        "title": "Advances in Deep Learning for Natural Language Processing",
        "abstract": "We optimize transformer models for question answering without image data.",
    }
    matches, score = matches_boolean_criteria(paper, spec)
    assert matches is False
    assert score == 0


def test_rejects_when_not_clause_matched():
    spec = parse_boolean_query("Deep learning AND Image processing NOT Medical")
    paper = {
        "title": "Deep Learning for Medical Image Processing and CT Scans",
        "abstract": "We benchmark neural networks on radiology datasets.",
    }
    matches, score = matches_boolean_criteria(paper, spec)
    assert matches is False
    assert score == 0


def test_handles_hyphenated_phrases():
    spec = parse_boolean_query("Deep learning AND Image processing")
    paper = {
        "title": "Novel Deep-Learning Strategies in Image-Processing",
        "abstract": "A review of modern techniques.",
    }
    matches, score = matches_boolean_criteria(paper, spec)
    assert matches is True
    assert score > 0


def test_stage1_salience_ranking_priority():
    """
    Stage 1 relevance check: Papers with phrases in the title receive higher
    relevance score (+10 per phrase) than passing mentions in abstract (+3),
    ensuring they are ranked at the top of the corpus.
    """
    spec = parse_boolean_query("Deep learning AND Image processing")
    p_title = {
        "title": "Deep Learning in Satellite Image Processing",
        "abstract": "Methodological overview.",
        "citation_count": 10,
        "influential_citation_count": 2,
    }
    p_abstract = {
        "title": "Advances in Computer Vision Architectures",
        "abstract": "We evaluate deep learning on image processing datasets.",
        "citation_count": 10,
        "influential_citation_count": 2,
    }
    match_t, score_t = matches_boolean_criteria(p_title, spec)
    match_a, score_a = matches_boolean_criteria(p_abstract, spec)
    assert match_t is True
    assert match_a is True
    assert score_t > score_a

    # Sorting behavior simulation in Stage 1
    ranked = sorted([p_abstract, p_title], key=lambda p: matches_boolean_criteria(p, spec)[1], reverse=True)
    assert ranked[0]["title"] == p_title["title"]


def test_s2_quoted_query_dispatch():
    """
    Verifies that multi-phrase queries generate quoted expressions
    suitable for upstream S2 bulk search filtering.
    """
    spec = parse_boolean_query('"Federated Learning" AND "Differential Privacy" NOT "Edge Devices"')
    assert spec["clean_s2_query"] == '"federated learning" "differential privacy"'
    assert spec["must_not"] == ["edge devices"]


if __name__ == "__main__":
    test_parse_boolean_query_unquoted_and()
    test_parse_boolean_query_quoted_and()
    test_parse_boolean_query_with_not()
    test_parse_boolean_query_with_or()
    test_parse_boolean_query_with_ampersand()
    test_matches_both_phrases_present()
    test_rejects_single_words_scattered()
    test_rejects_only_one_phrase_present()
    test_rejects_when_not_clause_matched()
    test_handles_hyphenated_phrases()
    test_stage1_salience_ranking_priority()
    test_s2_quoted_query_dispatch()
    print("ALL 12 TESTS (INCLUDING STAGE 1 RELEVANCE) PASSED SUCCESSFULLY!")
