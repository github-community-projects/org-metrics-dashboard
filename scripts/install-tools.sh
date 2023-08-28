#!/bin/bash

set -euo pipefail

echo "==> Installing golang tools"

go install github.com/go-delve/delve/cmd/dlv@latest
go install golang.org/x/tools/gopls@latest
go install golang.org/x/tools/cmd/goimports@latest
go install github.com/rogpeppe/godef@latest

echo "==> golang tools installation complete!"