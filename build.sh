#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "=== [1/3] Installing Python Dependencies ==="
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "=== [2/3] Installing Frontend Dependencies & Building Assets ==="
npm --prefix frontend install
npm --prefix frontend run build

echo "=== [3/3] Build Completed Successfully ==="
