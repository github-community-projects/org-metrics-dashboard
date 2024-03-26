#!/bin/bash

set -euo pipefail

echo "==> Installing go tools"

go install github.com/go-delve/delve/cmd/dlv@latest
go install golang.org/x/tools/gopls@latest
go install golang.org/x/tools/cmd/goimports@latest
go install github.com/rogpeppe/godef@latest

echo "==> go tools installed!"

echo "==> Installing gh extensions"

gh extension install https://github.com/nektos/gh-act

echo "==> gh extensions installed!"
