"""Contract tests for the EchoLab backend.

Run from backend/:  .venv/Scripts/python.exe -m pytest -q
These cover the response shape the frontend maps, JSON repair, and health.
"""

import json

from fastapi.testclient import TestClient

import main


client = TestClient(main.app)


def test_root_reports_models():
    res = client.get("/")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "EchoLab backend running"
    assert len(body["models"]) >= 1


def test_health_reports_ai_mode():
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["ai"] in ("configured", "demo")


def test_clean_json_handles_markdown_fence():
    raw = '```json\n{"episode_title": "T", "clips": []}\n```'
    assert main.clean_json_response(raw)["episode_title"] == "T"


def test_clean_json_handles_surrounding_prose():
    raw = 'Here you go:\n{"episode_title": "T", "clips": [1]}\nHope that helps.'
    assert main.clean_json_response(raw)["clips"] == [1]


def test_fallback_payload_shape():
    result = main.adaptive_video_result("my_episode.mp4")

    # Honesty contract: a locally generated result must say so.
    assert result["demo_mode"] is True
    assert result["episode_title"] == "My Episode"

    # Every list the frontend maps must be present and non-empty.
    for key in ("clips", "skipped_segments", "claims", "glossary", "brand_rules", "transcript"):
        assert isinstance(result[key], list) and result[key], key

    clip = result["clips"][0]
    for field in (
        "title", "start", "end", "excerpt", "reason", "hook_type", "score",
        "audio_proof", "visual_proof", "brand_fit", "risk", "language_mix",
        "reel_caption", "linkedin_copy", "whatsapp_status",
    ):
        assert field in clip, field

    # Claim statuses must use the exact strings the UI switches on.
    statuses = {"Verified from source", "Creator-approved", "Held for review"}
    assert all(c["status"] in statuses for c in result["claims"])

    # Round-trips as valid JSON for the HTTP layer.
    json.dumps(result)


def test_analyze_rejects_missing_file():
    res = client.post("/api/analyze")
    assert res.status_code == 422
